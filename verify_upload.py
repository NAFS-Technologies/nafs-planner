"""Run in API container: python manage.py shell < verify_upload.py.
Creates and deletes only its uniquely named storage test object.
"""
import uuid, requests, os
from urllib.parse import urlsplit
from django.conf import settings
from xml.etree import ElementTree
from django.test import RequestFactory
from plane.settings.storage import S3Storage
origin=os.environ.get('UPLOAD_TEST_ORIGIN',settings.WEB_URL)
request=RequestFactory().get('/',HTTP_HOST=urlsplit(origin).netloc)
key='taskflow-upload-check-'+uuid.uuid4().hex+'.txt'
body=b'TaskFlow upload verification\n'
storage=S3Storage(request=request)
upload=storage.generate_presigned_post(key,'text/plain',len(body))
try:
 response=requests.post(upload['url'],data=upload['fields'],files={'file':('upload-check.txt',body,'text/plain')},timeout=20)
 print('Upload status:',response.status_code)
 if response.status_code>=400:
  try:
   error=ElementTree.fromstring(response.text);print('Storage error:',error.findtext('Code'),error.findtext('Message'))
  except Exception:print('Response is not S3 XML')
 assert response.status_code in [200,201,204], 'Multipart storage upload failed'
 client=S3Storage().s3_client
 content=client.get_object(Bucket=storage.aws_storage_bucket_name,Key=key)['Body'].read()
 assert content==body
 for disposition in ['inline','attachment']:
  url=storage.generate_presigned_url(key,disposition=disposition,filename='preview-check.pdf',content_type='application/pdf')
  preview=requests.get(url,timeout=20)
  assert preview.status_code==200 and preview.content==body
  assert preview.headers.get('Content-Disposition','').startswith(disposition), preview.headers.get('Content-Disposition')
  assert preview.headers.get('Content-Type','').split(';')[0]=='application/pdf',preview.headers.get('Content-Type')
 print('Upload, preview/download response headers and file contents verified.')
finally:S3Storage().s3_client.delete_object(Bucket=storage.aws_storage_bucket_name,Key=key)
