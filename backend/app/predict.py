import pickle
from fastapi import APIRouter
from pydantic import BaseModel
from pathlib import Path

router = APIRouter()

# 🔹 Correct path to model.pkl
BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = BASE_DIR / "mlmodel" / "model.pkl"

# 🔹 Load model only once (when server starts)
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)


# 🔹 Input schema (for Swagger + validation)
class SkillInput(BaseModel):
    Python: int
    SQL: int
    HTML: int
    CSS: int
    Java: int
    Communication: int
    Logic: int
    Math: int


# 🔹 Prediction API
@router.post("/predict")
def predict_career(data: SkillInput):
    try:
        input_data = [[
            data.Python,
            data.SQL,
            data.HTML,
            data.CSS,
            data.Java,
            data.Communication,
            data.Logic,
            data.Math
        ]]

        prediction = model.predict(input_data)[0]

        return {
            "Recommended Career": prediction
        }

    except Exception as e:
        return {
            "error": str(e)
        }