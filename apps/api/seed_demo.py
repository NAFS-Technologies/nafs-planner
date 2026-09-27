from django.db.models import F
"""Run with: python manage.py shell < seed_demo.py. Safe to rerun; no data deletion."""
from datetime import datetime, timedelta, time
from html import escape
from django.db import transaction
from django.db.models import Count
from django.utils import timezone
from plane.db.models import *
from plane.license.models import Instance, InstanceAdmin, InstanceConfiguration

PEOPLE = [
    ('admin', 'Khalid Saifullah', 'Founder & Head of Product', 20),
    ('tanvir.hasan', 'Tanvir Hasan', 'VP of Engineering', 20),
    ('mahmudur.rahman', 'Mahmudur Rahman', 'Principal Backend Architect', 15),
    ('sadia.afrin', 'Sadia Afrin', 'Staff Frontend Engineer', 15),
    ('ariful.islam', 'Ariful Islam', 'Senior SRE / DevOps Lead', 15),
    ('nusrat.jahan', 'Nusrat Jahan', 'Staff Mobile Engineer', 15),
    ('nafis.iqbal', 'Nafis Iqbal', 'Product Lead & Growth', 15),
    ('farhana.akter', 'Farhana Akter', 'Lead QA & Automation Engineer', 15),
    ('mehedi.hasan', 'Mehedi Hasan', 'Senior Full-Stack Engineer', 15),
    ('shamima.nasrin', 'Shamima Nasrin', 'Security & Compliance Lead', 15),
    ('rashedul.karim', 'Rashedul Karim', 'Senior Data & Analytics Engineer', 15),
    ('sumaiya.chowdhury', 'Sumaiya Chowdhury', 'Lead UI/UX Product Designer', 15),
    ('ashiqur.rahman', 'Ashiqur Rahman', 'Cloud Infrastructure & SRE', 15),
]
# Each workstream has ten concrete deliverables, assigned by specialty.
PROJECTS = [
 ('COM', 'Harbor Commerce Platform', 'Harbor Retail', [
  ('Catalog & Discovery', ['product taxonomy', 'catalog search API', 'search results UI', 'catalog deployment pipeline', 'mobile product cards', 'conversion funnel events', 'search regression suite', 'product import validation', 'catalog access controls', 'category navigation prototype']),
  ('Checkout & Payments', ['checkout requirements', 'payment idempotency API', 'checkout form accessibility', 'payment webhook monitoring', 'mobile checkout flow', 'checkout abandonment report', 'payment failure tests', 'order confirmation emails', 'PCI scope assessment', 'checkout usability study']),
  ('Inventory & Fulfillment', ['fulfillment service blueprint', 'inventory reservation transactions', 'warehouse picking dashboard', 'inventory backup recovery', 'barcode scanning flow', 'stockout analytics', 'oversell concurrency tests', 'shipment status integration', 'warehouse role permissions', 'picking workflow prototype']),
  ('Customer Loyalty', ['loyalty program rules', 'loyalty ledger API', 'rewards account interface', 'loyalty queue alerts', 'mobile rewards wallet', 'repeat purchase cohort report', 'reward expiry automation tests', 'refund points reconciliation', 'loyalty abuse protection', 'rewards onboarding prototype']),
  ('Launch & Optimization', ['launch acceptance checklist', 'catalog query optimization', 'storefront performance budget', 'blue-green production release', 'mobile release candidate', 'revenue attribution dashboard', 'end-to-end launch smoke suite', 'merchant support dashboard', 'production security review', 'launch design QA']),
 ]),
 ('CARE', 'CareBridge Patient Portal', 'CareBridge Clinics', [
  ('Patient Identity', ['patient onboarding requirements', 'patient identity matching API', 'accessible registration form', 'identity service deployment', 'mobile biometric sign-in', 'registration funnel report', 'identity recovery test suite', 'patient consent capture', 'health data threat model', 'patient onboarding prototype']),
  ('Appointments', ['appointment booking rules', 'availability scheduling API', 'clinician calendar interface', 'scheduler health alerts', 'mobile appointment reminders', 'clinic utilization dashboard', 'double-booking prevention tests', 'reschedule notification workflow', 'appointment authorization audit', 'booking usability study']),
  ('Secure Messaging', ['care team routing policy', 'message threading API', 'care conversation interface', 'message delivery monitoring', 'mobile message notifications', 'response time analytics', 'attachment message tests', 'unread count synchronization', 'message retention safeguards', 'conversation design review']),
  ('Clinical Documents', ['document sharing requirements', 'clinical document indexing', 'document preview accessibility', 'document backup restore drill', 'mobile document download', 'document access audit report', 'upload validation test suite', 'lab result publication flow', 'signed document URL controls', 'results navigation prototype']),
  ('Pilot & Compliance', ['clinic pilot rollout plan', 'clinical API performance tuning', 'patient portal accessibility fixes', 'clinic pilot deployment', 'mobile pilot distribution', 'pilot engagement dashboard', 'clinical workflow regression suite', 'patient support triage tools', 'consent compliance evidence', 'pilot usability findings']),
 ]),
 ('FLEET', 'SwiftFleet Logistics Suite', 'SwiftFleet Delivery', [
  ('Dispatch Foundation', ['dispatch operating model', 'delivery job API', 'dispatcher board interface', 'dispatch service deployment', 'driver job inbox', 'dispatch throughput dashboard', 'job assignment test suite', 'bulk delivery import', 'dispatcher permission boundaries', 'dispatch interaction prototype']),
  ('Routing & Tracking', ['route planning acceptance rules', 'route optimization adapter', 'live map tracking interface', 'tracking stream monitoring', 'driver location batching', 'route efficiency analytics', 'GPS outage recovery tests', 'ETA calculation service', 'location privacy controls', 'tracking map usability study']),
  ('Proof of Delivery', ['delivery proof requirements', 'delivery evidence API', 'delivery evidence review interface', 'evidence storage lifecycle', 'mobile signature capture', 'delivery dispute dashboard', 'offline proof synchronization tests', 'delivery receipt generation', 'evidence access audit', 'proof capture prototype']),
  ('Billing & Settlements', ['carrier settlement rules', 'settlement reconciliation API', 'carrier invoice interface', 'billing batch monitoring', 'driver earnings summary', 'cost per delivery dashboard', 'settlement rounding tests', 'invoice export integration', 'payout approval controls', 'settlement workflow prototype']),
  ('Regional Rollout', ['regional launch checklist', 'tracking API load tuning', 'dispatcher performance fixes', 'regional failover deployment', 'driver app release candidate', 'regional SLA dashboard', 'fleet launch regression suite', 'operations incident console', 'regional access compliance', 'driver feedback design updates']),
 ]),
 ('LEARN', 'Northstar Learning Platform', 'Northstar Academy', [
  ('Course Authoring', ['course publishing requirements', 'course outline API', 'lesson editor interface', 'content service deployment', 'mobile course catalog', 'course authoring analytics', 'lesson publishing tests', 'course import tool', 'author permission controls', 'course editor prototype']),
  ('Learner Experience', ['learning journey acceptance rules', 'learner enrollment API', 'accessible lesson player', 'video playback monitoring', 'offline lesson downloads', 'learner retention cohorts', 'playback recovery tests', 'lesson progress synchronization', 'learner data privacy', 'learner navigation prototype']),
  ('Assessments', ['assessment scoring rubric', 'assessment attempt API', 'quiz builder interface', 'assessment queue alerts', 'mobile quiz submissions', 'assessment difficulty report', 'scoring edge case tests', 'certificate generation', 'assessment integrity controls', 'quiz usability study']),
  ('Teams & Reporting', ['corporate learning requirements', 'team enrollment API', 'manager reporting interface', 'reporting job monitoring', 'mobile learning streaks', 'team completion dashboard', 'team enrollment regression tests', 'HR roster import', 'organization data isolation', 'manager dashboard prototype']),
  ('Semester Launch', ['semester release checklist', 'enrollment API load tuning', 'learning interface polish', 'semester launch deployment', 'mobile store release', 'semester engagement dashboard', 'learning journey smoke suite', 'learner support console', 'launch privacy assessment', 'semester design QA']),
 ]),
 ('OPS', 'Agency Delivery Operations', 'Taskflow Agency (internal)', [
  ('Client Onboarding', ['agency onboarding playbook', 'client workspace provisioning API', 'client intake interface', 'workspace provisioning pipeline', 'mobile client approvals', 'sales-to-delivery funnel', 'onboarding regression suite', 'proposal handoff integration', 'client data access boundaries', 'client onboarding prototype']),
  ('Resource Planning', ['capacity planning policy', 'allocation conflict API', 'team capacity calendar', 'planning service monitoring', 'mobile allocation alerts', 'utilization analytics', 'allocation boundary tests', 'leave calendar integration', 'staff data privacy controls', 'capacity planning prototype']),
  ('Delivery Quality', ['definition of done playbook', 'release evidence API', 'quality scorecard interface', 'quality pipeline gates', 'mobile release approvals', 'defect escape dashboard', 'release gate automation', 'client acceptance workflow', 'security signoff checklist', 'quality review prototype']),
  ('Financial Visibility', ['agency margin reporting rules', 'project cost aggregation API', 'project margin interface', 'financial report monitoring', 'mobile expense submissions', 'project profitability dashboard', 'currency rounding test suite', 'invoice reconciliation flow', 'finance approval permissions', 'financial dashboard prototype']),
  ('Agency Scale-Up', ['quarterly delivery improvement plan', 'operations API optimization', 'agency dashboard accessibility', 'infrastructure disaster recovery', 'mobile management summary', 'portfolio health analytics', 'agency smoke test suite', 'cross-project dependency report', 'agency compliance evidence', 'portfolio dashboard design QA']),
 ]),
]
TODAY = timezone.localdate()
STATE_SPECS = [('Backlog','backlog','#60646C'), ('Todo','unstarted','#64748B'), ('In Progress','started','#F59E0B'), ('In Review','started','#8B5CF6'), ('Done','completed','#46A758'), ('Cancelled','cancelled','#9AA4BC')]
SLOT_STATES = ['Done','Done','In Review','Done','In Progress','Backlog','Todo','Done','Backlog','Cancelled']
ASSIGNMENTS = [6,2,3,4,5,10,7,8,9,11]
OFFSETS = [-63,-49,-35,-21,-7]

def timestamp(day):
    return timezone.make_aware(datetime.combine(day, time(10)))

def dated(obj, day, actor, updated=None):
    type(obj).objects.filter(pk=obj.pk).update(created_at=timestamp(day), updated_at=timestamp(updated or day), created_by=actor, updated_by=actor)
    return obj

def rich(text):
    return {'type':'doc','content':[{'type':'paragraph','content':[{'type':'text','text':text}]}]}

@transaction.atomic
def seed():
    users=[]
    for login,name,job,role in PEOPLE:
        user,_=User.objects.get_or_create(email=login+'@taskflow.dev',defaults={'username':login})
        user.first_name,user.last_name=name.split(' ',1)
        user.display_name=name
        user.is_active=user.is_email_verified=user.is_email_valid=True
        user.is_password_autoset=user.is_password_reset_required=False
        user.user_timezone='Asia/Dhaka'
        user.is_superuser=(login=='admin')
        user.set_password('12345678'); user.save()
        User.objects.filter(pk=user.pk).update(created_at=timestamp(TODAY-timedelta(days=120)),date_joined=timestamp(TODAY-timedelta(days=120)))
        users.append(user)
    owner=users[0]
    ws,_=Workspace.objects.get_or_create(slug='taskflow-agency',defaults={'name':'Taskflow Software Agency','owner':owner,'organization_size':'11-50','timezone':'Asia/Dhaka'})
    dated(ws,TODAY-timedelta(days=100),owner)
    for user,(_,_,job,role) in zip(users,PEOPLE):
        WorkspaceMember.objects.update_or_create(workspace=ws,member=user,defaults={'role':role,'company_role':job,'is_active':True})
        Profile.objects.update_or_create(user=user,defaults={'is_onboarded':True,'is_tour_completed':True,'is_navigation_tour_completed':True,'last_workspace_id':ws.id,'role':job,'company_name':ws.name,'onboarding_step':{k:True for k in ['profile_complete','workspace_create','workspace_invite','workspace_join']}})
        WorkspaceUserProperties.objects.get_or_create(workspace=ws,user=user)
        Sticky.objects.get_or_create(workspace=ws,owner=user,name='This week: '+job,defaults={'created_by':user,'updated_by':user,'description_html':'<p>Review assigned delivery tasks, flag blockers before standup, and attach acceptance evidence before moving work to Done.</p>','background_color':'#FEF3C7'})
    Sticky.objects.filter(workspace=ws,created_by__isnull=True).update(created_by=F('owner'),updated_by=F('owner'))
    instance=Instance.objects.first()
    if instance:
        Instance.objects.filter(pk=instance.pk).update(instance_name='Taskflow Agency Demo',is_setup_done=True,is_signup_screen_visited=True,is_telemetry_enabled=False)
        InstanceAdmin.objects.get_or_create(instance=instance,user=owner,defaults={'is_verified':True})
    for key,value in [('ENABLE_EMAIL_PASSWORD','1'),('ENABLE_SIGNUP','0')]:
        InstanceConfiguration.objects.update_or_create(key=key,defaults={'value':value,'category':'AUTHENTICATION','is_encrypted':False})
    types={}
    for name in ['Story','Task','Bug']:
        types[name],_=IssueType.objects.get_or_create(workspace=ws,name=name,defaults={'is_default':name=='Task'})
    projects=[]
    for pi,(code,name,client,workstreams) in enumerate(PROJECTS):
        project,_=Project.objects.get_or_create(workspace=ws,identifier=code,defaults={'name':name})
        project.description=f'{client}: agency delivery from discovery to production, with weekly client reviews and measurable acceptance criteria.'
        project.project_lead=users[1]; project.default_assignee=users[8]
        project.cycle_view=project.module_view=project.issue_views_view=project.page_view=project.intake_view=project.is_issue_type_enabled=True
        emoji={'COM':'128722','CARE':'129658','FLEET':'128666','LEARN':'127891','OPS':'9881'}[code]
        project.logo_props={'in_use':'emoji','emoji':{'value':emoji}}
        project.emoji=emoji
        project.cover_image='http://localhost:8080/demo-projects/'+code.lower()+'.svg'
        project.save(disable_auto_set_user=True)
        dated(project,TODAY-timedelta(days=90),owner)
        projects.append(project)
        ProjectIdentifier.objects.get_or_create(project=project,defaults={'workspace':ws,'name':code})
        for u,(_,_,_,role) in zip(users,PEOPLE):
            ProjectMember.objects.get_or_create(project=project,member=u,defaults={'role':role,'workspace':ws})
        for i,t in enumerate(types.values()):
            ProjectIssueType.objects.get_or_create(project=project,issue_type=t,defaults={'workspace':ws,'is_default':t.name=='Task','level':i})
        states={}
        for name,group,color in STATE_SPECS:
            states[name],_=State.objects.get_or_create(project=project,name=name,defaults={'workspace':ws,'group':group,'color':color,'default':name=='Backlog'})
        Project.objects.filter(pk=project.pk).update(default_state=states['Backlog'])
        labels={}
        for name,color in [('Backend','#2563EB'),('Frontend','#8B5CF6'),('Mobile','#EC4899'),('DevOps','#059669'),('Security','#DC2626'),('QA','#D97706'),('Analytics','#0891B2'),('Design','#7C3AED'),('Product','#475569')]:
            labels[name],_=Label.objects.get_or_create(project=project,name=name,defaults={'workspace':ws,'color':color})
        estimate,_=Estimate.objects.get_or_create(project=project,name='Fibonacci story points',defaults={'workspace':ws,'type':'points','last_used':True})
        points=[]
        for i,n in enumerate([1,2,3,5,8]):
            p,_=EstimatePoint.objects.get_or_create(project=project,estimate=estimate,key=i,defaults={'workspace':ws,'value':str(n),'description':f'{n} points'}); points.append(p)
        Project.objects.filter(pk=project.pk).update(estimate=estimate)
        for view,filters,layout in [('Delivery board',{},'kanban'),('Urgent client work',{'priority':['urgent','high']},'list'),('In flight',{'state_group':['started']},'kanban'),('Delivery calendar',{},'calendar')]:
            IssueView.objects.get_or_create(workspace=ws,project=project,name=view,defaults={'owned_by':users[6],'query':{},'filters':filters,'display_filters':{'layout':layout,'group_by':'state','order_by':'target_date','sub_issue':True,'show_empty_groups':True},'access':1})
        intake,_=Intake.objects.get_or_create(project=project,name='Client requests',defaults={'workspace':ws,'is_default':True,'description':f'Feature requests and defects from {client}.'})
        module_tasks=[]
        for sprint,(module_name,tasks) in enumerate(workstreams):
            start=TODAY+timedelta(days=OFFSETS[sprint]); end=start+timedelta(days=13)
            cycle,_=Cycle.objects.get_or_create(project=project,name=f'Sprint {sprint+1:02d} — {module_name}',defaults={'workspace':ws,'owned_by':users[1]})
            Cycle.objects.filter(pk=cycle.pk).update(start_date=timestamp(start),end_date=timestamp(end),description=f'{client}: deliver {module_name.lower()}. Ten committed tasks; unfinished historical work remains visible for follow-up.')
            dated(cycle,start-timedelta(days=5),users[1])
            module,_=Module.objects.get_or_create(project=project,name=module_name,defaults={'workspace':ws,'lead':users[2]})
            Module.objects.filter(pk=module.pk).update(start_date=start,target_date=end,status='completed' if sprint<4 else 'in-progress',description=f'{module_name} delivery package for {client}. Scope, QA evidence and launch readiness are tracked by linked work items.')
            dated(module,start-timedelta(days=8),users[6])
            for u in [users[i] for i in [1,2,3,7,8]]:
                ModuleMember.objects.get_or_create(project=project,module=module,member=u,defaults={'workspace':ws})
            created=[]
            for slot,title in enumerate(tasks):
                who=users[ASSIGNMENTS[slot]]
                if sprint==4 and slot==0:who=users[0]
                if sprint==4 and slot==1:who=users[1]
                if slot==3 and pi%2:who=users[12]
                task_start=start+timedelta(days=min(slot,7)); task_end=min(end,task_start+timedelta(days=2+slot%4))
                state=states[SLOT_STATES[slot]]
                if state.group=='completed':
                    task_start=start+timedelta(days=slot%3)
                    task_end=task_start+timedelta(days=2)
                name=title[0].upper()+title[1:]
                description=f'{client} / {module_name}: {name}. Owner: {who.full_name}. Acceptance: documented requirements agreed with Nafis; implementation reviewed by Tanvir; automated validation and client acceptance evidence recorded. '+('Historical carryover: reschedule in the delivery review.' if sprint<4 and state.group not in ['completed','cancelled'] else 'Review in the sprint demo before client handoff.')
                issue,_=Issue.objects.get_or_create(project=project,external_source='taskflow_demo',external_id=f'{code}-{sprint}-{slot}',defaults={'workspace':ws,'name':name})
                issue.name=name; issue.state=state; issue.start_date=task_start; issue.target_date=task_end
                issue.priority=['high','urgent','medium','high','medium','low','high','medium','high','low'][slot]
                issue.description_html='<p>'+escape(description)+'</p>'; issue.description_json=rich(description)
                issue.estimate_point=points[(slot+sprint)%5]; issue.type=types['Bug' if slot==6 else ('Story' if slot in [0,2,4,9] else 'Task')]
                issue.save(disable_auto_set_user=True)
                dated(issue,start-timedelta(days=4),users[6],min(TODAY,task_end))
                Issue.objects.filter(pk=issue.pk).update(completed_at=timestamp(task_end) if state.group=='completed' and task_end<=TODAY else None)
                IssueAssignee.objects.get_or_create(project=project,issue=issue,assignee=who,defaults={'workspace':ws})
                label=['Product','Backend','Frontend','DevOps','Mobile','Analytics','QA','Backend','Security','Design'][slot]
                IssueLabel.objects.get_or_create(project=project,issue=issue,label=labels[label],defaults={'workspace':ws})
                CycleIssue.objects.get_or_create(project=project,cycle=cycle,issue=issue,defaults={'workspace':ws})
                ModuleIssue.objects.get_or_create(project=project,module=module,issue=issue,defaults={'workspace':ws})
                IssueSubscriber.objects.get_or_create(project=project,issue=issue,subscriber=users[1],defaults={'workspace':ws})
                text=(f'{who.first_name}, please deliver {name.lower()} against the agreed acceptance criteria. '+('QA confirmed acceptance; reviewed in the client demo.' if state.group=='completed' else ('Removed from scope after client tradeoff review; keep the decision for the audit trail.' if state.group=='cancelled' else 'Record blockers and attach review evidence here before handoff.')))
                comment,_=IssueComment.objects.get_or_create(project=project,issue=issue,external_source='taskflow_demo',external_id=f'{code}-{sprint}-{slot}-comment',defaults={'workspace':ws,'actor':users[6],'comment_html':'<p>'+escape(text)+'</p>','comment_json':rich(text)})
                dated(comment,min(task_start,TODAY),users[6])
                activity,_=IssueActivity.objects.get_or_create(project=project,issue=issue,verb='created',defaults={'workspace':ws,'actor':users[6],'comment':'added this work item to the sprint scope','epoch':timestamp(start-timedelta(days=4)).timestamp()})
                dated(activity,start-timedelta(days=4),users[6])
                if sprint<=4:
                    activity,_=IssueActivity.objects.get_or_create(project=project,issue=issue,verb='updated',field='state',defaults={'workspace':ws,'actor':who,'old_value':'Todo','new_value':state.name,'old_identifier':states['Todo'].id,'new_identifier':state.id,'comment':f'moved this work item to {state.name}','epoch':timestamp(min(task_start,TODAY)).timestamp()})
                    dated(activity,min(task_start,TODAY),who)
                created.append(issue)
            # Design approval gates UI implementation; the API gates integration.
            for a,b in [(2,1),(7,1),(4,2)]:
                IssueRelation.objects.get_or_create(project=project,issue=created[a],related_issue=created[b],defaults={'workspace':ws,'relation_type':'blocked_by'})
                IssueRelation.objects.get_or_create(project=project,issue=created[b],related_issue=created[a],defaults={'workspace':ws,'relation_type':'blocking'})
            Issue.objects.filter(pk=created[7].pk).update(parent=created[1])
            module_tasks.append(created)
            page_text=f'{client} — {module_name}. Sprint window: {start} to {end}. Tanvir owns technical review; Nafis owns acceptance; Farhana signs off regression coverage. Discuss incomplete items at the next delivery review. Scope: '+', '.join(tasks)+'.'
            page,_=Page.objects.get_or_create(workspace=ws,name=f'{code} / {module_name} — delivery brief',defaults={'owned_by':users[6],'description_html':'<h2>'+escape(module_name)+'</h2><p>'+escape(page_text)+'</p>','description_json':rich(page_text)})
            dated(page,start-timedelta(days=8),users[6])
            ProjectPage.objects.get_or_create(workspace=ws,project=project,page=page)
            IssueLink.objects.get_or_create(project=project,issue=created[0],url=f'http://localhost:8080/{ws.slug}/projects/{project.id}/pages/{page.id}',defaults={'workspace':ws,'title':'Sprint delivery brief'})
        IntakeIssue.objects.get_or_create(project=project,intake=intake,issue=module_tasks[4][5],defaults={'workspace':ws,'status':-2,'source_email':users[6].email})
        UserFavorite.objects.get_or_create(workspace=ws,project=project,user=owner,entity_type='project',entity_identifier=project.id,defaults={'name':project.name})
        DeployBoard.objects.get_or_create(workspace=ws,project=project,entity_name='project',entity_identifier=project.id,defaults={'is_comments_enabled':True,'is_reactions_enabled':True,'is_votes_enabled':True,'intake':intake,'view_props':{'list':True,'kanban':True,'calendar':True,'gantt':True,'spreadsheet':True}})
    portfolio_text='Taskflow Agency delivers Harbor Commerce, CareBridge, SwiftFleet and Northstar through a shared delivery practice. Khalid approves scope and launch tradeoffs; Tanvir reviews architecture; Nafis manages acceptance. Farhana gates releases on QA evidence and Shamima approves security controls. Historical incomplete work is retained in its original sprint for audit and follow-up.'
    links=''.join(f'<li><a href="http://localhost:8080/{ws.slug}/projects/{p.id}/issues">{escape(p.name)}</a></li>' for p in projects)
    Page.objects.get_or_create(workspace=ws,name='Agency delivery handbook & portfolio',defaults={'owned_by':owner,'is_global':True,'description_html':'<h1>Agency delivery handbook</h1><p>'+portfolio_text+'</p><ul>'+links+'</ul>','description_json':rich(portfolio_text)})
    # Shared operations release evidence supports every client launch.
    ops=Issue.objects.get(project=projects[-1],external_id='OPS-4-2',external_source='taskflow_demo')
    for p in projects[:-1]:
        client_task=Issue.objects.get(project=p,external_id=f'{p.identifier}-4-2',external_source='taskflow_demo')
        IssueRelation.objects.get_or_create(project=p,issue=client_task,related_issue=ops,defaults={'workspace':ws,'relation_type':'relates_to'})
        IssueRelation.objects.get_or_create(project=projects[-1],issue=ops,related_issue=client_task,defaults={'workspace':ws,'relation_type':'relates_to'})
    verify(ws,users)
    print('Demo seeded: 13 users, 5 projects, 250 tasks, 25 cycles, 25 modules, 26 pages.')

def verify(ws,users=None):
    assert WorkspaceMember.objects.filter(workspace=ws).count()==13
    assert Project.objects.filter(workspace=ws).count()==5
    assert Issue.objects.filter(workspace=ws).count()==250
    assert not Issue.objects.filter(workspace=ws,start_date__isnull=True).exists()
    assert not Issue.objects.filter(workspace=ws,target_date__isnull=True).exists()
    for project in Project.objects.filter(workspace=ws):
        assert Issue.objects.filter(project=project).count()==50
        assert set(Issue.objects.filter(project=project).values_list('state__name',flat=True))==set(s[0] for s in STATE_SPECS)
        assert Cycle.objects.filter(project=project).count()==5
        for cycle in Cycle.objects.filter(project=project):
            issues=Issue.objects.filter(issue_cycle__cycle=cycle)
            assert issues.count()==10
            assert set(issues.values_list('state__name',flat=True))==set(s[0] for s in STATE_SPECS)
            for issue in issues:
                assert issue.start_date<=issue.target_date
                assert cycle.start_date.date()<=issue.start_date<=issue.target_date<=cycle.end_date.date()
                assert IssueAssignee.objects.filter(issue=issue).exists()
                assert ModuleIssue.objects.filter(issue=issue,module__project=project).exists()
    for u in users or User.objects.filter(email__endswith='@taskflow.dev'):
        assert u.check_password('12345678')
    print('PASS: counts, permissions, passwords, assignments, module/cycle links, all sprint statuses and date bounds.')

seed()
