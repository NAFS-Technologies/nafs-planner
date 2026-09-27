"""Run with: python manage.py shell < verify_attachment_preview.py.
Rolls back the verification asset; does not modify demo records.
"""
from unittest.mock import patch
from django.db import transaction
from rest_framework.test import APIClient
from plane.db.models import FileAsset, Issue, User
issue=Issue.objects.select_related('workspace').first()
client=APIClient();client.force_authenticate(User.objects.get(email='admin@taskflow.dev'))
with transaction.atomic():
 asset=FileAsset.objects.create(workspace=issue.workspace,project_id=issue.project_id,issue=issue,asset='preview-check',is_uploaded=True,entity_type='ISSUE_ATTACHMENT')
 urls=[asset.asset_url,f'/api/assets/v2/workspaces/{issue.workspace.slug}/{asset.id}/']
 for mime,expected in [('application/pdf','inline'),('image/png','inline'),('text/plain','inline'),('image/svg+xml','attachment'),('text/html','attachment'),('application/octet-stream','attachment')]:
  asset.attributes={'name':'preview-check','type':mime};asset.save(update_fields=['attributes'])
  for url in urls:
   with patch('plane.app.views.asset.v2.S3Storage') as storage, patch('plane.app.views.issue.attachment.S3Storage',storage):
    storage.return_value.generate_presigned_url.return_value='http://example.test/file'
    response=client.get(url)
    assert response.status_code==302,(url,response.status_code)
    args=storage.return_value.generate_presigned_url.call_args.kwargs
    assert args['disposition']==expected,(mime,url,args)
    if expected=='inline':assert args['content_type']==mime
 transaction.set_rollback(True)
print('Both attachment routes preview PDF/image/text and download unsafe or unsupported files; demo data unchanged.')
