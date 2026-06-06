from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.core.dependencies import get_db # type: ignore
from app.models.code_chunk import CodeChunk # type: ignore

from app.schemas.chat import ChatRequest # type: ignore
from app.services.embeddings.embedding_service import generate_embedding # type: ignore
from app.services.llm.llm_service import ask_llm # type: ignore

router = APIRouter()

@router.post("/")
def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db)
):
    query_embedding = generate_embedding(payload.query)

    distance = CodeChunk.embedding.cosine_distance(query_embedding)

    results = (
        db.query(CodeChunk, distance.label("distance"))
        .filter(CodeChunk.repository_id == payload.repository_id)
        .order_by(distance)
        .limit(10)
        .all()
    )

    context = "\n\n".join(
        [
            f"""
        File: {chunk.file.path}
        Chunk: {chunk.chunk_name}

        Code: 
        {chunk.content[:1500]}

        """.strip()
            for chunk, distance in results
        ]
    )

    history_text = ""

    for msg in payload.history:
        history_text += (
            f"{msg.role.capitalize()}:"
            f"{msg.content}\n"
        )

    prompt = f"""
    You are an expert software engineer.

    Answer using ONLY the provided code context.

    If the answer cannot be found in the code,
    say so.

    Conversation History:
    {history_text}

    Current Question:
    {payload.query}

    Code Context:
    {context}
    """

    answer = ask_llm(prompt)

    

    return {
    "answer": answer,
    "sources": [
        {
            "file": chunk.file.path,
            "chunk": chunk.chunk_name,
            "chunk_type": chunk.chunk_type,
            "distance": round(float(distance), 4),
            "content": chunk.content[:500]
        }
        for chunk, distance in results
    ]
}