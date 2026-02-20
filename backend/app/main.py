from fastapi import FastAPI

app = FastAPI(title="CareerLens API")

@app.get("/")
def home():
    return {"message": "CareerLens backend is running"}