# Database

We use Supabase Postgres with the PostGIS extension enabled.

- All schema and migrations are stored in the `supabase/` folder.
- Backend code in `api/` interacts with the database via SQLAlchemy and GeoAlchemy2.
- DO NOT use the Supabase client library in the web application for database access; all database interactions must go through the FastAPI backend (`api/`).

## Known Gotcha: Schema Synchronization

`Base.metadata.create_all()` is used to create tables from SQLAlchemy models, but it **only creates missing tables**. It **does NOT alter existing tables** when a model's columns change (e.g. adding a new field like `description`). 

Therefore, any future schema change to `api/models.py` requires either a manual `ALTER TABLE` executed directly against Supabase, or adopting Alembic for proper database migrations. This is a deliberate technical trade-off for prototyping speed, but it means models and the live database schema can easily fall out of sync silently and cause 500 errors.
