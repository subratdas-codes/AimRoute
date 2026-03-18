from pydantic import BaseModel
from typing import Dict

class QuizSubmit(BaseModel):
    answers: Dict[int, str]   # Example: {1: "A", 2: "B", 3: "C"}