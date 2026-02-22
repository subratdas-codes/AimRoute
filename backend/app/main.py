from fastapi import FastAPI

# Database
from app.database.connection import engine
from app.database.base import Base

# IMPORTANT: load all models (this makes tables create)
from app.models import user_model, question_model

# Routes
from app.routes import auth_routes
from app.routes import login_routes
from app.routes import user_routes
from app.routes import quiz_routes

# Create FastAPI app
app = FastAPI(title="AimRoute API")

# Create all tables in MySQL
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth_routes.router, tags=["Auth"])
app.include_router(login_routes.router, tags=["Login"])
app.include_router(user_routes.router, tags=["User"])
app.include_router(quiz_routes.router, tags=["Quiz"])

# Home route
@app.get("/")
def home():
    return {"message": "AimRoute backend running successfully 🚀"}