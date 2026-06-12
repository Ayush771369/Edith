from pydantic import BaseModel #type: ignore
from typing import List, Literal


class EntityInfo(BaseModel):
    type: Literal["class", "function"]
    name: str
    start_line: int
    end_line: int


class FileInfo(BaseModel):
    path: str
    language: str
    entities: List[EntityInfo]


class RepositoryMapResponse(BaseModel):
    repository_id: int
    repository_name: str
    files: List[FileInfo]