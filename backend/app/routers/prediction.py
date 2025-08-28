

from fastapi import APIRouter
from app.services import prediction_service
import pandas as pd


router = APIRouter()

# @router.get('/')
# def predict_sample():
#     result = prediction_service.simple_model()
#     return {"accuracy": result}

DATAFRAMES = {}  # using db instead of this
MODELS = {}

@router.post("/train/{session_id}/{target}")
async def train(session_id: str, target: str):
    if session_id not in DATAFRAMES:
        return {"error": "no dataset uploaded for this session"}
    df = DATAFRAMES[session_id]
    result = prediction_service.train_model(df, target)
    return result


@router.post("/predict/{session_id}")
async def predict(session_id : str, new_data: dict):
    if session_id not in MODELS:
        return {"error" : "Could not find "}    
    
    model = MODELS[session_id]
    df = pd.DataFrame([new_data])
    pred =  model.predict(df.select_dtypes(include = (["int64", "float64"])))

    return { "predictions" : pred.tolist()}



