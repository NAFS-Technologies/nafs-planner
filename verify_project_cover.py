"""Run with: python manage.py shell < verify_project_cover.py."""
from plane.db.models import Project

stored = "http://localhost:8080/demo-projects/care.svg"
project = Project(cover_image=stored)
assert project.cover_image_url == "/demo-projects/care.svg", project.cover_image_url
assert project.cover_image == stored, "Rendering must not alter stored data"
external = "https://example.org/cover.svg"
assert Project(cover_image=external).cover_image_url == external
assert Project(cover_image=None).cover_image_url is None
print("Project banner URLs work on any deployment origin; stored values are unchanged.")
