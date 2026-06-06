from pydantic import BaseModel # type: ignore

class SearchRequest(BaseModel):
    query: str
    repository_id: int