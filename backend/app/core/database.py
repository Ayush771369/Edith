from sqlalchemy import create_engine #type: ignore 
from sqlalchemy.orm import sessionmaker, declarative_base #type: ignore 
from dotenv import load_dotenv #type: ignore
import os

load_dotenv() # Load environment variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL") # Get the database URL from environment variables

engine = create_engine(DATABASE_URL) # Create a SQLAlchemy engine

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # Create a session factory

Base = declarative_base() # Create a base class for declarative models