

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import dataset, prediction, query

app = FastAPI(title = "Predictive Data Insights API")

# frontend will talk to backend here 
# cors: cross origin resource sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["*"] ,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],

)

# Registry Router 
app.include_router(dataset.router, prefix = "/api/dataset", tags = ["Datatset"])
app.include_router(prediction.router, prefix = "/api/prediction", tags = ["Prediction"])
app.include_router(query.router, prefix = "/api/query", tags = ["Query"])


@app.get('/')
def home():
    return {"message" : "Backend is running"}


