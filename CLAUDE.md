# Darukaa.Earth Architecture & Context

This is a full-stack geospatial dashboard for carbon/biodiversity projects.

## Tech Stack
- **Frontend (web/):** React (Vite) + Mapbox GL JS + mapbox-gl-draw + Chart.js
- **Backend (api/):** FastAPI + SQLAlchemy + GeoAlchemy2
- **Database:** Supabase Postgres with PostGIS extension enabled
- **Auth:** custom JWT (PyJWT/python-jose + passlib) issued by api/
- **Deploy:** Vercel (web/), Render.com (api/)
- **CI:** GitHub Actions

## Structure
- `api/`: Python FastAPI application
- `web/`: React frontend application
- `supabase/`: SQL migrations and schema
- `docs/`: Project documentation

Read the relevant files in `docs/` for specific module instructions.

## Non-negotiable requirements checklist
- [x] End-to-end authentication (login/register via API)
- [x] Project and Site creation
- [x] Map view with polygon drawing (mapbox-gl-draw)
- [x] Site detail analytics chart (Chart.js)

## Progress Log
- **2026-09-17**: Implemented FastAPI backend and React frontend. Created auth flow, project/site management, map drawing, and analytics charts. Backend and frontend are fully integrated and working.
