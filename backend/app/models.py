
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
import pickle
import pandas as pd

Base = declarative_base()

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(Integer, primary_key = True)
    session_id = Column(String(255), unique = True, index = True)
    filename = Column(String(255))
    data = Column(LargeBinary)
    columns_info = Column(JSONB)
    summary = Column(JSONB)
    created_at = Column(DateTime, default = datetime.utcnow)


    def set_dataframe(self, df: pd.DataFrame):

        self.data = pickle.dumps(df)
        self.columns_info = {
            "columns" : list(df.columns),
            "dtypes" : {col: str(df[col].dtype) for col in df.columns},
            "shape" : df.shape
        }
   
    def get_dataframe(self) -> pd.DataFrame:

        if self.data is None:
            raise ValueError("No data stored")
        
        return pickle.loads(self.data)

class Model(Base):
    __tablename__ = "models"

    id = Column(Integer, primary_key = True)
    session_id = Column(String(255), index = True)
    target_column = Column(String(255))
    model_type = Column(String(50))
    model_data = Column(LargeBinary)
    metrics = Column(JSONB)
    feature_cols = Column(JSONB)
    created_at = Column(DateTime, default = datetime.utcnow)

    def set_model(self, model, feature_columns: list):
        self.model_data = pickle.dumps(model)
        self.feature_cols = feature_columns

    def get_model(self):
        if self.model_data is None:
            raise ValueError("No model stored")
        return pickle.loads(self.model_data)
    
    

class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key = True)
    session_id = Column(String, index = True)
    question = Column(Text)
    generated_code = Column(Text)
    result = Column(JSONB)
    created_at = Column(DateTime, default = datetime.utcnow)
    

