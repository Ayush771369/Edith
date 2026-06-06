from pydantic import BaseModel # type: ignore


class ChatHistoryItem(BaseModel):
    role: str
    content: str
    sources: list = []
    timestamp: str

class ChatRequest(BaseModel):
    repository_id: int
    query: str
    history: list[ChatHistoryItem] = []