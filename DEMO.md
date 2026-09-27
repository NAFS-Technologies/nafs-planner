# Taskflow agency demo

URL: http://localhost:8080

All passwords: `12345678`. Workspace: Taskflow Software Agency.

| Name | Email | Functional role | Permission |
| --- | --- | --- | --- |
| Khalid Saifullah | admin@taskflow.dev | Founder & Head of Product | Admin (20) |
| Tanvir Hasan | tanvir.hasan@taskflow.dev | VP of Engineering | Admin (20) |
| Mahmudur Rahman | mahmudur.rahman@taskflow.dev | Principal Backend Architect | Member (15) |
| Sadia Afrin | sadia.afrin@taskflow.dev | Staff Frontend Engineer | Member (15) |
| Ariful Islam | ariful.islam@taskflow.dev | Senior SRE / DevOps Lead | Member (15) |
| Nusrat Jahan | nusrat.jahan@taskflow.dev | Staff Mobile Engineer | Member (15) |
| Nafis Iqbal | nafis.iqbal@taskflow.dev | Product Lead & Growth | Member (15) |
| Farhana Akter | farhana.akter@taskflow.dev | Lead QA & Automation Engineer | Member (15) |
| Mehedi Hasan | mehedi.hasan@taskflow.dev | Senior Full-Stack Engineer | Member (15) |
| Shamima Nasrin | shamima.nasrin@taskflow.dev | Security & Compliance Lead | Member (15) |
| Rashedul Karim | rashedul.karim@taskflow.dev | Senior Data & Analytics Engineer | Member (15) |
| Sumaiya Chowdhury | sumaiya.chowdhury@taskflow.dev | Lead UI/UX Product Designer | Member (15) |
| Ashiqur Rahman | ashiqur.rahman@taskflow.dev | Cloud Infrastructure & SRE | Member (15) |

Verified: 5 projects, 250 tasks, 25 sprints (10 tasks each), 25 modules and 26 pages. All tasks have start/due dates and every sprint has all six workflow statuses.

Start: `docker compose -p taskflow-demo -f docker-compose.demo.json up -d`

Reseed: `docker compose -p taskflow-demo -f docker-compose.demo.json exec -T api python manage.py shell < seed_demo.py`

Stop, preserving data: `docker compose -p taskflow-demo -f docker-compose.demo.json down`

Docker is intentionally left running. External integrations require provider credentials. The UI label is Sprint; API and database names remain Cycle.

Taskflow branding replaces the upstream UI logos, favicons, manifests and labels. Customer endorsements, Community badges, upstream marketing and GitHub promotional links are removed. Each project has a themed icon and banner. Seeded stickies record their owner as creator so editing works.

Verify: `docker compose -p taskflow-demo -f docker-compose.demo.json exec -T api python manage.py shell < verify_demo.py`

Local documentation: http://localhost:8080/taskflow-agency/pages/

Brand SVGs have transparent backgrounds; the UI brightens them in dark mode. Verify assets with `python3 branding/verify_assets.py`.

The credential-bearing local `docker-compose.demo.json` is ignored. `docker-compose.demo.example.json` documents the stack with environment placeholders and relative paths. Supply credentials through a local `.env` and the existing `taskflow-demo-api` / `taskflow-demo-live` images before using the example.
