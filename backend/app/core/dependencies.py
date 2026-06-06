from app.core.database import SessionLocal #type: ignore

def get_db():
    db = SessionLocal() # Create a new database session
    try:
        yield db # Yield the database session to be used in API endpoints
    finally:
        db.close() # Ensure the database session is closed after use