

from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import pandas as pd
from app.services import dataset_service, chart_service
from app.models import Dataset
from app.database import get_db
import uuid  # universally unique identifiers


router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    
    # generating session id 
    session_id = str(uuid.uuid4())
    
    df = await dataset_service.process_file(file)

    dataset = Dataset(
        session_id = session_id,
        filename = file.filename
    )

    dataset.set_dataframe(df)

    summary = dataset_service.get_summary(df)
    dataset.summary = summary

    db.add(dataset)
    db.commit()

    charts = chart_service.suggest_charts(df)
    return {
        "session_id": session_id,
        "summary" : summary,
        "charts" : charts,
        }



