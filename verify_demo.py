"""Run: docker compose -p taskflow-demo -f docker-compose.demo.json exec -T api python manage.py shell < verify_demo.py"""
from django.db import transaction
from django.db.models import Count, F
from rest_framework.test import APIClient
from plane.db.models import Sticky, Project, Issue, Cycle, CycleIssue, User

assert Project.objects.count() >= 5
for project in Project.objects.all():
    assert 30 <= Issue.objects.filter(project=project).count() <= 50
    assert project.logo_props.get('in_use') and project.cover_image
    expected_states = set(Issue.objects.filter(project=project).values_list('state_id', flat=True))
    assert len(expected_states) == 6
    for sprint in Cycle.objects.filter(project=project):
        tasks = CycleIssue.objects.filter(cycle=sprint)
        assert tasks.count() >= 10
        assert set(tasks.values_list('issue__state_id', flat=True)) == expected_states
assert not Issue.objects.filter(start_date__isnull=True).exists()
assert not Issue.objects.filter(target_date__isnull=True).exists()
assert not Issue.objects.filter(start_date__gt=F('target_date')).exists()
assert not Sticky.objects.exclude(created_by=F('owner')).exists()
with transaction.atomic():
    sticky = Sticky.objects.first()
    client = APIClient()
    client.force_authenticate(sticky.owner)
    url = f'/api/workspaces/{sticky.workspace.slug}/stickies/{sticky.pk}/'
    response = client.patch(url, {'description_html': '<p>Verified delivery note.</p>'}, format='json')
    assert response.status_code == 200, (response.status_code, response.data)
    client.force_authenticate(User.objects.exclude(pk=sticky.owner_id).first())
    response = client.patch(url, {'description_html': '<p>Unauthorized update.</p>'}, format='json')
    assert response.status_code == 403
    transaction.set_rollback(True)
print('Demo checks passed: project assets, task dates, sticky ownership and edit permissions.')
