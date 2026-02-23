from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.predict import router as predict_router

app = FastAPI(
    title="AimRoute API",
    version="1.0.0",
    description="AI-Based Career Guidance and Recommendation System"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict_router)

@app.get("/")
def home():
    return {
        "message": "AimRoute Backend is running successfully 🚀"
    }