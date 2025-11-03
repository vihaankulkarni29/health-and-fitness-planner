from fastapi import FastAPI

from app.api.v1.api import api_router

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello World"}

# Include API routers
app.include_router(api_router, prefix="/api/v1")
