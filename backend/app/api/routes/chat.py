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
    retrieval_query = payload.query
    if payload.history:
        recent_history = "\n".join(
            [
                f"{msg.role.capitalize()}: {msg.content}"
                for msg in payload.history[-5:]
            ]
        )
        retrieval_query = f"""
        Previous conversation:
        {recent_history}

        Current question:
        {payload.query}
        """
    query_embedding = generate_embedding(retrieval_query)

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
            ========================================
            FILE: {chunk.file.path}
            SYMBOL: {chunk.chunk_name}
            TYPE: {chunk.chunk_type}
            ========================================

            {chunk.content[:1200]}
            """
        .strip()
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
        You are Edith, an AI codebase assistant.

        You are answering questions about a specific indexed repository.

        RULES:

        1. Use ONLY information found in the provided code context.
        2. Do NOT use outside knowledge.
        3. If the answer is not present in the code context, respond exactly:

        "I cannot find this information in the indexed repository."

        4. When possible, mention:
        - file paths
        - class names
        - function names

        5. If explaining a workflow or execution path:
        - explain step by step
        - reference the relevant symbols

        6. Do not invent files, functions, classes, or behavior.

        Conversation History:
        {history_text}

        Current Question:
        {payload.query}

        Retrieved Code Context:

        {context}

        Answer:
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
            "content": chunk.content[:1000]
        }
        for chunk, distance in results
    ]
}