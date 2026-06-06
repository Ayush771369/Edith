from sqlalchemy import Column, Integer, String, DateTime #type: ignore
from sqlalchemy.sql import func #type: ignore
from sqlalchemy.orm import relationship #type: ignore

from app.core.database import Base #type: ignore

class Repository(Base):
    __tablename__ = "repositories"

    files = relationship("File", back_populates="repository")

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, unique=True, index=True, nullable=False)

    github_url = Column(String, unique=True, index=True, nullable=False)

    local_path = Column(String, nullable=False)

    status = Column(String, nullable=False, default="processing")

    created_at = Column(DateTime(timezone=True), server_default=func.now())  