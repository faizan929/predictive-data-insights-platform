

from fastapi import APIRouter
from app.services import query_service
from .prediction import DATAFRAMES




router = APIRouter()


@router.post("/query/{session_id}")
async def query(session_id: str, question: str):

    if session_id not in DATAFRAMES:
        return {
            "error" : "no dataset uploaded"
        }
    
    df = DATAFRAMES[session_id]
    result = query_service.query_dataframe(df, question)
    return {
        "question": question,
        "result": result,
    }




