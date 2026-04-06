from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.assessments import careers_router, router as assessments_router
from app.routers.auth import router as auth_router
from app.routers.users import router as users_router

app = FastAPI(
    title="AimRoute API",
    description="Career guidance platform — recommends career paths based on user interests and skills.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(assessments_router)
app.include_router(careers_router)


@app.get("/", tags=["health"])
def health_check():
    return {"status": "ok", "service": "AimRoute API"}
