import pickle
import numpy as np
from fastapi import APIRouter
from pydantic import BaseModel
from pathlib import Path

router = APIRouter()

# Load model
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "mlmodel" / "model.pkl"

with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

# Input schema
class SkillInput(BaseModel):
    Python: int
    SQL: int
    HTML: int
    CSS: int
    Java: int
    Communication: int
    Logic: int
    Math: int


@router.post("/predict")
def predict_career(data: SkillInput):

    input_data = np.array([[
        data.Python,
        data.SQL,
        data.HTML,
        data.CSS,
        data.Java,
        data.Communication,
        data.Logic,
        data.Math
    ]])

    probabilities = model.predict_proba(input_data)[0]
    classes = model.classes_

    top_indices = np.argsort(probabilities)[-3:][::-1]

    top_careers = []

    for i in top_indices:
        top_careers.append({
            "career": classes[i],
            "confidence": f"{round(probabilities[i]*100, 2)}%"
        })

    return {
        "top_careers": top_careers
    }