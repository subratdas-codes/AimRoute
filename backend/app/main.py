from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.predict import router as predict_router

# Create FastAPI app
app = FastAPI(
    title="CareerLens API",
    version="1.0.0",
    description="ML-based Career Recommendation System"
)

# Enable CORS (for frontend connection)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # For development (React/HTML can connect)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Predict Router
app.include_router(predict_router)

# Root endpoint
@app.get("/")
def home():
    return {
        "message": "CareerLens Backend is running successfully 🚀"
    }