from fastapi import FastAPI

# Database
from app.database.connection import engine
from app.database.base import Base

# 🔥 VERY IMPORTANT — load ALL models here
from app.models import user_model, question_model, result_model

# Routes
from app.routes import auth_routes
from app.routes import login_routes
from app.routes import user_routes
from app.routes import quiz_routes
from app.routes import result_routes
from app.routes import dashboard_routes

# Create FastAPI app
app = FastAPI(title="AimRoute API")

# Create all tables in MySQL
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth_routes.router, tags=["Auth"])
app.include_router(login_routes.router, tags=["Login"])
app.include_router(user_routes.router, tags=["User"])
app.include_router(quiz_routes.router, tags=["Quiz"])
app.include_router(result_routes.router, tags=["Results"])
app.include_router(dashboard_routes.router, tags=["Dashboard"])

# Home route
@app.get("/")
def home():
    return {"message": "AimRoute backend running successfully 🚀"}