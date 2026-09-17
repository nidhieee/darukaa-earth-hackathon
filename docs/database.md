# Database

We use Supabase Postgres with the PostGIS extension enabled.

- All schema and migrations are stored in the `supabase/` folder.
- Backend code in `api/` interacts with the database via SQLAlchemy and GeoAlchemy2.
- DO NOT use the Supabase client library in the web application for database access; all database interactions must go through the FastAPI backend (`api/`).
