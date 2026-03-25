from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine
from app.database.base import Base

from app.models import user_model, question_model, result_model
from app.models import college_model                    # ADDED

from app.routes import auth_routes
from app.routes import login_routes
from app.routes import user_routes
from app.routes import quiz_routes
from app.routes import result_routes
from app.routes import dashboard_routes
from app.routes import college_routes                  # ADDED
from app import predict

app = FastAPI(title="AimRoute API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth_routes.router, tags=["Auth"])
app.include_router(login_routes.router, tags=["Login"])
app.include_router(user_routes.router, tags=["User"])
app.include_router(quiz_routes.router, tags=["Quiz"])
app.include_router(result_routes.router, tags=["Results"])
app.include_router(dashboard_routes.router, tags=["Dashboard"])
app.include_router(college_routes.router, tags=["Colleges"])  # ADDED
app.include_router(predict.router, tags=["ML"])

@app.get("/")
def home():
    return {"message": "AimRoute backend is running"}