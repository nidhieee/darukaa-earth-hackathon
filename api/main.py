from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .database import engine, Base
from .auth import routes as auth_routes
from .routers import projects, sites

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Darukaa.Earth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(projects.router)
app.include_router(sites.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
