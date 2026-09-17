import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from shapely.geometry import shape

from ..database import get_db
from ..models import Project, Site
from ..schemas import ProjectCreate, ProjectOut, SiteCreate, SiteOut
from ..auth.utils import get_current_user
from ..models import User
from ..config import settings

router = APIRouter(prefix="/projects", tags=["projects"])

@router.post("", response_model=ProjectOut)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    new_project = Project(**project.model_dump(), owner_id=current_user.id)
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("", response_model=list[ProjectOut])
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    projects = db.query(Project).filter(Project.owner_id == current_user.id).all()
    
    for project in projects:
        for site in project.sites:
            geom_json = db.scalar(text("SELECT ST_AsGeoJSON(geom) FROM sites WHERE id = :id"), {"id": site.id})
            site.geom = json.loads(geom_json) if geom_json else None
            
    return projects

@router.post("/{project_id}/sites", response_model=SiteOut)
def create_site(project_id: str, site: SiteCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == current_user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    try:
        geom_shape = shape(site.geom)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid GeoJSON geometry")

    geom_wkt = geom_shape.wkt
    
    area_m2 = db.execute(text("SELECT ST_Area(ST_GeomFromText(:wkt, 4326)::geography)"), {"wkt": geom_wkt}).scalar()
    if area_m2 is None:
        raise HTTPException(status_code=400, detail="Could not calculate area from geometry")
        
    area_hectares = area_m2 / 10000.0
    carbon_estimate_tons = area_hectares * settings.SEQUESTRATION_RATE_CONST

    new_site = Site(
        project_id=project.id,
        name=site.name,
        geom=geom_wkt,
        area_hectares=area_hectares,
        carbon_estimate_tons=carbon_estimate_tons,
        health_score='yellow'
    )
    db.add(new_site)
    db.commit()
    db.refresh(new_site)
    
    new_site.geom = site.geom 
    return new_site
