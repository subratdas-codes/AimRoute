from fastapi import FastAPI
from app.predict import router as predict_router

app = FastAPI(title="CareerLens API")

app.include_router(predict_router)