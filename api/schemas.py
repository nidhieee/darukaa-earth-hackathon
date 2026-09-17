from pydantic import BaseModel, EmailStr, ConfigDict
from typing import List, Optional, Any, Dict
from datetime import datetime, date
import uuid

# User
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Site
class SiteCreate(BaseModel):
    name: str
    geom: Dict[str, Any] # GeoJSON polygon geometry

class AnalyticsOut(BaseModel):
    id: uuid.UUID
    recorded_at: date
    carbon_tons: float
    biodiversity_index: float
    model_config = ConfigDict(from_attributes=True)

class SiteOut(BaseModel):
    id: uuid.UUID
    project_id: uuid.UUID
    name: str
    area_hectares: float
    carbon_estimate_tons: float
    health_score: str
    created_at: datetime
    geom: Any = None 
    analytics: List[AnalyticsOut] = []
    model_config = ConfigDict(from_attributes=True)

class SiteGeoJSON(BaseModel):
    type: str = "Feature"
    geometry: Dict[str, Any]
    properties: Dict[str, Any]

# Project
class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectOut(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str] = None
    created_at: datetime
    sites: List[SiteOut] = []
    model_config = ConfigDict(from_attributes=True)
