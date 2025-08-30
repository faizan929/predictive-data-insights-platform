

from sqlalchemy import create_engine, text


DATABASE_URL = "postgresql://postgres:faizan123@localhost:5432/predictive_data_insights_platform"


engine = create_engine(DATABASE_URL)


def test_connection():
    try:
        with engine.connect() as conn:
            version = conn.execute(text("SELECT version();")).fetchone()
            print("connected successfully")
            print("version:", version[0])

    except Exception as e:
        print("connection failed")
        print("error", e)

if __name__ == "__main__":
    test_connection()
