from fastapi import FastAPI
from app.database.connection import engine
from app.database.base import Base
from app.models import user_model
from app.routes import auth_routes, login_routes
from app.routes import user_routes

# FIRST create app
app = FastAPI(title="CareerLens API")

# Create database tables
Base.metadata.create_all(bind=engine)

# Register routes
app.include_router(auth_routes.router)
app.include_router(login_routes.router)
app.include_router(user_routes.router)


# Home route
@app.get("/")
def home():
    return {"message": "CareerLens backend running"}