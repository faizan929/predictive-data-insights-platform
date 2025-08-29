

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services import query_service
from app.models.database import Dataset
from app.services.database_service import get_db




router = APIRouter()


@router.post("/query/{session_id}")
async def query(session_id: str, question: str, db = Depends(get_db)):

    dataset = db.query(Dataset).filter(Dataset.session_id == session_id).first()
    if not dataset:
        return {"error" : "dataset not found for the current session"}
    

    df = dataset.get_DataFrame()
    result = query_service.query_dataframe(df, question)

    return {
        "question" : question, 
        "result" : result
    }






