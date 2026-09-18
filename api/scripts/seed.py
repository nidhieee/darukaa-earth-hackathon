import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))

from api.database import SessionLocal, engine, Base  # noqa: E402
from api.models import User, Project, Site, AnalyticsSnapshot  # noqa: E402
from api.auth.utils import hash_password  # noqa: E402
from api.config import settings  # noqa: E402
from sqlalchemy import text  # noqa: E402
from datetime import date, timedelta  # noqa: E402
import random  # noqa: E402


def seed_db():
    print("Creating tables (if they don't exist)...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    demo_email = "demo@darukaa.earth"
    demo_password = "demo1234"

    existing_user = db.query(User).filter(User.email == demo_email).first()
    if existing_user:
        print("Demo user already exists. Clearing data for a fresh seed...")
        db.query(AnalyticsSnapshot).delete()
        db.query(Site).delete()
        db.query(Project).delete()
        db.query(User).filter(User.email == demo_email).delete()
        db.commit()

    print("Creating demo user...")
    user = User(email=demo_email, password_hash=hash_password(demo_password))
    db.add(user)
    db.commit()
    db.refresh(user)

    print("Creating projects...")
    proj1 = Project(
        owner_id=user.id,
        name="Western Ghats Reforestation",
        description="Biodiversity hotspot restoration",
    )
    proj2 = Project(
        owner_id=user.id,
        name="Mangrove Conservation",
        description="Coastal protection and carbon sink",
    )
    db.add_all([proj1, proj2])
    db.commit()
    db.refresh(proj1)
    db.refresh(proj2)

    print("Creating sites...")
    poly1_wkt = "POLYGON((73.8 18.5, 73.81 18.5, 73.81 18.51, 73.8 18.51, 73.8 18.5))"
    poly2_wkt = "POLYGON((74.0 18.0, 74.05 18.0, 74.05 18.05, 74.0 18.05, 74.0 18.0))"

    sites_data = [
        (proj1.id, "Site A", poly1_wkt),
        (proj1.id, "Site B", poly2_wkt),
        (
            proj2.id,
            "Coastal Site",
            "POLYGON((80.2 13.0, 80.21 13.0, 80.21 13.01, 80.2 13.01, 80.2 13.0))",
        ),
    ]

    sites = []
    for pid, name, wkt in sites_data:
        area_m2 = db.execute(
            text("SELECT ST_Area(ST_GeomFromText(:wkt, 4326)::geography)"), {"wkt": wkt}
        ).scalar()
        area_hectares = area_m2 / 10000.0
        carbon_estimate_tons = area_hectares * settings.SEQUESTRATION_RATE_CONST

        site = Site(
            project_id=pid,
            name=name,
            geom=wkt,
            area_hectares=area_hectares,
            carbon_estimate_tons=carbon_estimate_tons,
            health_score="yellow",
        )
        db.add(site)
        db.commit()
        db.refresh(site)
        sites.append(site)

    print("Generating analytics...")
    today = date.today()
    for site in sites:
        base_carbon = site.carbon_estimate_tons
        base_bio = 0.5
        for i in range(6, 0, -1):
            recorded_at = today - timedelta(days=30 * i)
            variation = random.uniform(-0.02, 0.05)
            base_carbon = base_carbon * (1 + variation)
            base_bio = min(1.0, max(0.0, base_bio + random.uniform(-0.05, 0.08)))

            snapshot = AnalyticsSnapshot(
                site_id=site.id,
                recorded_at=recorded_at,
                carbon_tons=base_carbon,
                biodiversity_index=base_bio,
            )
            db.add(snapshot)
    db.commit()

    print("\n--- SEED COMPLETE ---")
    print(f"Login Email: {demo_email}")
    print(f"Login Password: {demo_password}")


if __name__ == "__main__":
    seed_db()
