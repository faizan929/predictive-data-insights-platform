

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.services import query_service
from app.models import Dataset
from app.database import get_db


router = APIRouter()

@router.post("/query/{session_id}")
async def query(session_id: str, question: str, db = Depends(get_db)):
    
    dataset = db.query(Dataset).filter(Dataset.session_id == session_id).first()
    if not dataset:
        return {"error" : "dataset not found for the current session"}
    
    df = dataset.get_dataframe()
    result = query_service.query_dataframe(df, question)
    return {
        "question" : question, 
        "result" : result
    }






