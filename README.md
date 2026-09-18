# Darukaa.Earth — Geospatial Carbon & Biodiversity Dashboard

A full-stack platform for managing and visualizing carbon and biodiversity projects. Built for the Darukaa.Earth Full-Stack Developer Hackathon Challenge.

- **Live demo:** https://darukaa-earth-hackathon.vercel.app
- **Backend API:** https://darukaa-earth-hackathon.onrender.com
- **Demo login:** `demo@darukaa.earth` / `demo1234`

> **Note on the free-tier backend:** the API is hosted on Render's free tier, which spins down after inactivity. The first request after a period of idle time may take up to ~50 seconds to respond while the server wakes up. Subsequent requests are fast.

---

## 1. High-Level Architecture

```
┌─────────────┐      HTTPS (JWT Bearer)      ┌──────────────┐      SQLAlchemy       ┌──────────────────┐
│   React SPA │ ───────────────────────────▶ │   FastAPI    │ ────────────────────▶ │  PostgreSQL +     │
│  (Vercel)   │ ◀─────────────────────────── │  (Render)    │ ◀──────────────────── │  PostGIS (Supabase)│
└─────────────┘         JSON / GeoJSON        └──────────────┘                       └──────────────────┘
       │
       │ Mapbox GL JS + mapbox-gl-draw
       ▼
  Interactive map, polygon drawing
```

**Frontend** (`/web`): React (Vite), Mapbox GL JS for the interactive map and polygon drawing, Chart.js for time-series analytics, React Router for navigation, Axios for API calls, custom auth context backed by JWT stored client-side.

**Backend** (`/api`): FastAPI, SQLAlchemy + GeoAlchemy2 for PostGIS-aware ORM models, custom JWT authentication (PyJWT/python-jose + passlib/bcrypt for password hashing), Pydantic schemas for request/response validation.

**Database**: PostgreSQL with the PostGIS extension, hosted on Supabase (managed Postgres — chosen for zero-setup-time provisioning in a time-boxed hackathon; see Trade-offs below).

**Why this split:** the brief explicitly separates a Python backend from a React frontend and asks for PostGIS-backed geometry — a monolithic framework (e.g. Next.js API routes) wasn't an option since Python and JavaScript can't share one runtime. Keeping `/api` and `/web` as independent, separately-deployable services also mirrors how a real production system in this domain would likely be structured.

---

## 2. Database Schema

All tables live in the default Supabase Postgres schema, with the `postgis` extension enabled (`CREATE EXTENSION IF NOT EXISTS postgis;`).

### `users`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid`, PK | |
| `email` | `text`, unique | |
| `password_hash` | `text` | bcrypt via passlib |
| `created_at` | `timestamptz` | default `now()` |

### `projects`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid`, PK | |
| `owner_id` | `uuid`, FK → `users.id` | |
| `name` | `text` | |
| `description` | `text` | nullable |
| `created_at` | `timestamptz` | |

### `sites`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid`, PK | |
| `project_id` | `uuid`, FK → `projects.id` | |
| `name` | `text` | |
| `description` | `text` | nullable |
| `geom` | `geometry(Polygon, 4326)` | via GeoAlchemy2 |
| `area_hectares` | `float` | computed on insert from `ST_Area(geography(geom)) / 10000` |
| `carbon_estimate_tons` | `float` | `area_hectares × SEQUESTRATION_RATE_CONST` (see §5) |
| `health_score` | `text` | `'green'` \| `'yellow'` \| `'red'`, derived from the trend of the two most recent analytics snapshots |
| `created_at` | `timestamptz` | |

### `analytics_snapshots`
| Column | Type | Notes |
|---|---|---|
| `id` | `uuid`, PK | |
| `site_id` | `uuid`, FK → `sites.id` | |
| `recorded_at` | `date` | |
| `carbon_tons` | `float` | seeded mock time-series |
| `biodiversity_index` | `float` | seeded mock, 0–100 range |

**Relationships:** one user → many projects; one project → many sites; one site → many analytics snapshots. Geometry is stored once, permanently, at site creation — sites cannot have their polygon edited after creation (name/description can be edited; area cannot), which keeps the carbon-estimate calculation trustworthy and avoids needing to version geometry history.

---

## 3. Local Setup

### Prerequisites
- Python 3.11+
- Node.js 20+
- A Supabase (or any PostGIS-enabled Postgres) instance
- A Mapbox account (free tier) for a public access token

### Backend
```bash
cd api
python -m venv .venv
# Windows:
.venv\Scripts\Activate.ps1
# macOS/Linux:
source .venv/bin/activate

pip install -r requirements.txt
```

Create `.env.local` at the **repo root** with:
```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/postgres
JWT_SECRET=<a random 32+ byte hex string>
SEQUESTRATION_RATE_CONST=8.0
CORS_ORIGINS=["http://localhost:5173"]
```

Run the API:
```bash
uvicorn api.main:app --reload --port 8000
```

Seed demo data (creates a demo user, 2 projects, several sites, and 6 months of mock analytics):
```bash
python api/scripts/seed.py
```

### Frontend
```bash
cd web
npm install
```

Create `web/.env.local` with:
```
VITE_API_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=<your Mapbox public token>
```

Run the dev server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`, calling the API at `http://localhost:8000`.

### Running both together
A unified script exists at the repo root (`npm run dev`, using `concurrently`) to boot both servers with one command. On some Windows setups the relative venv path in this script needs adjusting to match your local environment — if it fails, fall back to running the two commands above in separate terminals.

---

## 4. CI/CD Pipeline

### Pre-commit hooks (local, runs before every `git commit`)
- **Frontend** (`/web`): Husky + lint-staged run Prettier and ESLint on staged `.js/.jsx/.css` files, auto-fixing what it can and blocking the commit on unresolved errors.
- **Backend** (`/api`): the `pre-commit` framework runs `black` (auto-formatting) and `flake8` (linting) on staged Python files, configured via `.pre-commit-config.yaml` and `.flake8` (line length aligned to Black's 88-character default).

Both were verified by intentionally introducing a formatting/lint violation and confirming the commit was correctly blocked/auto-fixed before being allowed through.

### GitHub Actions (`.github/workflows/ci.yml`)
Runs on every `push` and `pull_request`:
- **`frontend` job**: installs dependencies and runs `npm run build`, catching any build-breaking errors.
- **`backend` job**: installs dependencies and runs `flake8` across `/api`, catching lint violations that may have slipped past local hooks.

This gives a second, server-side enforcement layer independent of any individual contributor's local hook setup.

### Deployment
- **Backend** → Render.com, auto-deploying from the `main` branch. Build: `pip install -r api/requirements.txt`. Start: `uvicorn api.main:app --host 0.0.0.0 --port $PORT`.
- **Frontend** → Vercel, auto-deploying from the `main` branch, root directory `web`, Vite preset.
- Both platforms redeploy automatically on every push to `main` — no manual deploy step is needed after the initial setup.

---

## 5. Key Design Decisions & Trade-offs

**Auto-computed carbon estimate.** When a site polygon is saved, the backend computes its area via PostGIS's `ST_Area(geography(geom))` and multiplies by a configurable `SEQUESTRATION_RATE_CONST` (default 8.0 tons CO₂/hectare/year, a ballpark reforestation figure) to produce an immediate carbon estimate — turning a raw drawn shape into an actionable number without extra manual entry. The constant is intentionally a rough, documented assumption rather than a precise scientific figure, since real-world sequestration rates vary enormously by ecosystem, climate, and species; a production version would need this to be configurable per project type or sourced from a proper carbon-accounting methodology.

**Health score.** Derived from the trend between a site's two most recent analytics snapshots (improving/stable → green, flat → yellow, declining → red). This is a deliberately simple heuristic, prioritized for clear visual signal (color-coded map markers) over statistical sophistication, given the time constraints of the challenge.

**Managed Postgres over self-hosted.** Using Supabase's hosted Postgres+PostGIS instead of standing up a local/self-managed instance saved significant setup time and let development start immediately, at the cost of some infrastructure control — an acceptable trade for a time-boxed build.

**Mock/seeded analytics data.** Real satellite or field-sensor data ingestion is out of scope for this challenge; the seed script generates 6 months of plausible mock time-series data per site so the analytics/charting UI has real data to render against from the start.

**Schema migrations.** `Base.metadata.create_all()` (used at startup) only creates missing tables — it does not alter existing ones when a model's columns change. During development this required a manual `ALTER TABLE` once when a new column was added after the table already existed. For a longer-lived project, adopting Alembic for proper versioned migrations would be the next step.

**Permanent site geometry.** Once a site's polygon is drawn and saved, it cannot be edited (only its name/description can). This avoids the complexity of re-validating or re-deriving carbon estimates against an edited shape, and matches how a real monitoring system would likely treat a surveyed boundary — as a fixed record, not a mutable one.

---

## 6. Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend framework | React (Vite) |
| Mapping | Mapbox GL JS + mapbox-gl-draw |
| Charting | Chart.js (react-chartjs-2) |
| Backend framework | FastAPI |
| ORM | SQLAlchemy + GeoAlchemy2 |
| Database | PostgreSQL + PostGIS (Supabase) |
| Auth | Custom JWT (python-jose, passlib/bcrypt) |
| CI | GitHub Actions |
| Pre-commit | Husky + lint-staged (frontend), pre-commit + black + flake8 (backend) |
| Deployment | Vercel (frontend), Render.com (backend) |
