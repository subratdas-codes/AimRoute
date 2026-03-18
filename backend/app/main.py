from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Database
from app.database.connection import engine
from app.database.base import Base

# Load models
from app.models import user_model, question_model, result_model

# Routes
from app.routes import auth_routes
from app.routes import login_routes
from app.routes import user_routes
from app.routes import quiz_routes
from app.routes import result_routes
from app.routes import dashboard_routes

# App
app = FastAPI(title="AimRoute API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow React frontend 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables in mysql
Base.metadata.create_all(bind=engine)

# Routers register 
app.include_router(auth_routes.router, tags=["Auth"])
app.include_router(login_routes.router, tags=["Login"])
app.include_router(user_routes.router, tags=["User"])
app.include_router(quiz_routes.router, tags=["Quiz"])
app.include_router(result_routes.router, tags=["Results"])
app.include_router(dashboard_routes.router, tags=["Dashboard"])

# Home route
@app.get("/")
def home():
    return {"message": "AimRoute backend is running"}