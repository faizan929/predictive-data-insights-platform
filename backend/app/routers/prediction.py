

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.services import prediction_service
import pandas as pd
from app.models.database import Dataset, Model
from app.services.database_service import get_db

# from app.database import get_db

router = APIRouter()


@router.post("/train/{session_id}/{target}")
async def train(session_id: str, target: str, db: Session = Depends(get_db)):
    
    dataset = db.query(Dataset).filter(Dataset.session_id == session_id).first()
    if not dataset:
        return {"error": "no dataset present for this session"}

    df = dataset.get_dataframe()
    result = prediction_service.train_model(df, target)
    model_record = Model(
        session_id = session_id,
        target_column = target,
        model_type = result["task"],
        metrics = result["metrics"]
    )
    model_record.set_model(result["model"], result["feature_columns"])
    db.add(model_record)
    db.commit()
    return {
        "task" : result["task"],
        "metrics" : result["metrics"],
        "predictions" : result["predictions"]
    }



@router.post("/predict/{session_id}")
async def predict(session_id : str, new_data: dict, db: Session = Depends(get_db)):

    model_record = db.query(Model).filter(Model.session_id == session_id).first()
    if not model_record:
        return {
            "error" : "No trained model found for this "
        }

    try:
        trained_model = model_record.get_model()
        feature_columns = model_record.feature_cols

        df = pd.DataFrame([new_data])

        prediction_features = df[feature_columns]

        pred = trained_model.predict(prediction_features)

        return {
            "predictions" : pred.tolist()
        }

    except Exception as e:
        return {
            "error" : f"Prediction failed: {str(e)}"
        }

    


