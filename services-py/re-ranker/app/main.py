# services-py/re-ranker/app/main.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"service": "re-ranker"}