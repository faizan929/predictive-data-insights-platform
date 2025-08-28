

import pandas as pd 
from io import BytesIO


async def process_file(file):
    contents = await file.read()
    df = pd.read_csv(BytesIO(contents))
    return df

def get_summary(df: pd.DataFrame):

    summary = {
        "shape": {
            "rows": df.shape[0],
            "columns": df.shape[1]
        },
        "columns":[
            {
                "name": col,
                "dtype": str(df[col].dtype),
                "nulls": int(df[col].isnull().sum())
            }
            for col in df.columns
        ],
        "describe": df.describe(include = "all").fillna("").to_dict(),
        "sample": df.head(5).to_dict(orient = "records")
    }
    
    return {
        "summary" : summary
    }

