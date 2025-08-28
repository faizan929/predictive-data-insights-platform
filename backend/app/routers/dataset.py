

from fastapi import APIRouter, UploadFile, File
import pandas as pd
from app.services import dataset_service, chart_service


router = APIRouter()


@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    df = await dataset_service.process_file(file)
    summary = dataset_service.get_summary(df)
    charts = chart_service.suggest_charts(df)
    return {
        "summary" : summary,
        "charts" : charts,
        }



