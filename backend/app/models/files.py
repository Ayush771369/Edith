from sqlalchemy import Column, Integer, String, ForeignKey #type: ignore
from sqlalchemy.orm import relationship #type: ignore

from app.core.database import Base #type: ignore

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    repository_id = Column(Integer, ForeignKey("repositories.id"))

    path = Column(String, nullable=False)

    language = Column(String)

    size = Column(Integer)

    repository = relationship("Repository")

    parsed_entities = relationship("ParsedEntity", back_populates="file")

    code_chunks = relationship("CodeChunk", back_populates="file")