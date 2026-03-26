from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import engine
from app.database.base import Base

from app.models import user_model, question_model, result_model
from app.models import college_model

from app.routes import auth_routes
from app.routes import login_routes
from app.routes import user_routes
from app.routes import quiz_routes
from app.routes import result_routes
from app.routes import dashboard_routes
from app.routes import college_routes
from app import predict

app = FastAPI(
    title="AimRoute AI Career API",
    version="1.0.0"
)

# ✅ CORS (frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # your React app
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Create tables
Base.metadata.create_all(bind=engine)

# ✅ Routes with PREFIX (IMPORTANT)
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(login_routes.router, prefix="/auth", tags=["Login"])
app.include_router(user_routes.router, prefix="/users", tags=["User"])
app.include_router(quiz_routes.router, prefix="/quiz", tags=["Quiz"])
app.include_router(result_routes.router, prefix="/results", tags=["Results"])
app.include_router(dashboard_routes.router, prefix="/dashboard", tags=["Dashboard"])
app.include_router(college_routes.router, prefix="/colleges", tags=["Colleges"])
app.include_router(predict.router, prefix="/ml", tags=["ML"])

# ✅ Home
@app.get("/")
def home():
    return {"message": "AimRoute backend is running"}

# ✅ Health check (professional touch)
@app.get("/health")
def health():
    return {"status": "OK"}