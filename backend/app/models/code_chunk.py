from sqlalchemy import Column, Integer, String, Text,  ForeignKey #type: ignore
from sqlalchemy.orm import relationship #type: ignore

from pgvector.sqlalchemy import Vector #type: ignore

from app.core.database import Base #type: ignore

class CodeChunk(Base):
    __tablename__ = "code_chunks"

    id = Column(Integer, primary_key=True, index=True)
    
    file_id = Column(
        Integer,
        ForeignKey('files.id'),
        nullable=False
    )
    repository_id = Column(
        Integer,
        ForeignKey('repositories.id'), 
        nullable=False)

    chunk_type = Column(String)  # 'class' or 'function'
    chunk_name = Column(String)

    language = Column(String)

    content = Column(Text) 

    start_line = Column(Integer)
    end_line = Column(Integer)

    embedding = Column(Vector(768))  # Assuming 768-dimensional embeddings from OpenAI's text-embedding-3-small

    file = relationship("File", back_populates="code_chunks")