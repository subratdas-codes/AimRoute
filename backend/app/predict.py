import pickle
import os
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# Define input schema
class SkillInput(BaseModel):
    Python: int
    SQL: int
    HTML: int
    CSS: int
    Java: int
    Communication: int
    Logic: int
    Math: int

# Load model
model_path = os.path.join(os.path.dirname(__file__), "../../mlmodel/model.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)


@router.post("/predict")
def predict_career(data: SkillInput):
    features = [[
        data.Python,
        data.SQL,
        data.HTML,
        data.CSS,
        data.Java,
        data.Communication,
        data.Logic,
        data.Math
    ]]

    prediction = model.predict(features)

    return {"Recommended Career": prediction[0]}