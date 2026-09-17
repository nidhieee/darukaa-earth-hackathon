from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
import json
from ..database import get_db
from ..models import Site, AnalyticsSnapshot
from ..schemas import SiteOut, AnalyticsOut
from ..auth.utils import get_current_user
from ..models import User

router = APIRouter(prefix="/sites", tags=["sites"])

def recompute_health_score(site: Site, db: Session):
    snapshots = db.query(AnalyticsSnapshot).filter(AnalyticsSnapshot.site_id == site.id).order_by(AnalyticsSnapshot.recorded_at.desc()).limit(2).all()
    if len(snapshots) < 2:
        return site.health_score

    curr = snapshots[0]
    prev = snapshots[1]

    curr_score = curr.carbon_tons + curr.biodiversity_index
    prev_score = prev.carbon_tons + prev.biodiversity_index
    diff = curr_score - prev_score

    if diff > 0:
        new_health = 'green'
    elif diff < -0.1: 
        new_health = 'red'
    else:
        new_health = 'yellow'

    if site.health_score != new_health:
        site.health_score = new_health
        db.commit()
    
    return site.health_score

@router.get("/{site_id}", response_model=SiteOut)
def get_site(site_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site or site.project.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Site not found")
    
    recompute_health_score(site, db)
    
    geom_json = db.scalar(text("SELECT ST_AsGeoJSON(geom) FROM sites WHERE id = :id"), {"id": site_id})
    site.geom = json.loads(geom_json) if geom_json else None
    
    return site

@router.get("/{site_id}/analytics", response_model=list[AnalyticsOut])
def get_site_analytics(site_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    site = db.query(Site).filter(Site.id == site_id).first()
    if not site or site.project.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Site not found")
        
    snapshots = db.query(AnalyticsSnapshot).filter(AnalyticsSnapshot.site_id == site.id).order_by(AnalyticsSnapshot.recorded_at.asc()).all()
    return snapshots
