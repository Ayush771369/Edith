from sqlalchemy import Column, Integer, String, ForeignKey #type: ignore
from sqlalchemy.orm import relationship #type: ignore

from app.core.database import Base #type: ignore

class ParsedEntity(Base):
    __tablename__ = "parsed_entities"

    id = Column(Integer, primary_key=True, index=True)
    
    file_id = Column(
        Integer,
        ForeignKey('files.id'),
        nullable=False
    )

    entity_type = Column(String, nullable=False)  # 'class' or 'function'

    entity_name = Column(String, nullable=False)


    start_line = Column(Integer)

    end_line = Column(Integer)

    file = relationship("File", back_populates="parsed_entities")