from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv()

from app.database.connection import engine
from app.database.base import Base

from app.models import user_model, question_model, result_model, college_model
from app.models.question_model import Question, QuestionOption

from app.routes import auth_routes
from app.routes import login_routes
from app.routes import user_routes
from app.routes import quiz_routes
from app.routes import result_routes
from app.routes import dashboard_routes
from app.routes import college_routes
from app.routes.chat_routes import router as chat_router

from app.predict import router as ml_router
from app.routes.admin_routes import router as admin_router
from app.routes.career_routes import router as career_router

# ── App must be created BEFORE any include_router calls ──────
app = FastAPI(
    title="AimRoute AI Career API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# ── Register all routers ──────────────────────────────────────
app.include_router(auth_routes.router,      prefix="/auth",  tags=["Auth"])
app.include_router(login_routes.router,     prefix="/auth",  tags=["Login"])
app.include_router(user_routes.router,                       tags=["User"])
app.include_router(quiz_routes.router,      prefix="/quiz",  tags=["Quiz"])
app.include_router(result_routes.router,                     tags=["Results"])
app.include_router(dashboard_routes.router,                  tags=["Dashboard"])
app.include_router(college_routes.router,                    tags=["Colleges"])
app.include_router(chat_router,                              tags=["Chat"])
app.include_router(ml_router,               prefix="/ml",    tags=["ML"])
app.include_router(admin_router)
app.include_router(career_router)

@app.get("/")
def home():
    return {"message": "AimRoute backend is running"}

@app.get("/health")
def health():
    return {"status": "OK"}