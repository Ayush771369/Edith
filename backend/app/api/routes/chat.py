from fastapi import APIRouter, Depends  # type: ignore
from sqlalchemy.orm import Session  # type: ignore

from app.core.dependencies import get_db  # type: ignore

from app.schemas.chat import ChatRequest  # type: ignore

from app.services.llm.llm_service import ask_llm  # type: ignore
from app.services.search.hybrid_search import hybrid_search  # type: ignore

router = APIRouter()


@router.post("/")
def chat(
    payload: ChatRequest,
    db: Session = Depends(get_db)
):
    # -------------------------
    # Build Retrieval Query
    # -------------------------
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

    # -------------------------
    # Hybrid Search
    # -------------------------
    results = hybrid_search(
        repository_id=payload.repository_id,
        query=retrieval_query,
        db=db,
        limit=10
    )
    if not results:
        return {
            "answer": "I cannot find this information in the indexed repository.",
            "sources": []
        }
    print("BEST SCORE:", results[0]["score"] )

    # -------------------------
    # Build Context
    # -------------------------
    context = "\n\n".join(
        [
            f"""
========================================
FILE: {item["chunk"].file.path}
SYMBOL: {item["chunk"].chunk_name}
TYPE: {item["chunk"].chunk_type}
========================================

{item["chunk"].content[:1200]}
""".strip()
            for item in results
        ]
    )

    # -------------------------
    # Build History Text
    # -------------------------
    history_text = ""

    for msg in payload.history:
        history_text += (
            f"{msg.role.upper()}:\n"
            f"{msg.content}\n\n"
        )

    # -------------------------
    # Prompt
    # -------------------------
    prompt = f"""
You are Edith, an AI codebase assistant.

You are answering questions about a specific indexed repository.

RULES:

1. Use ONLY information found in the provided code context.

2. Do not infer, assume, or speculate.

Only state facts that are directly supported by the retrieved code context.

If a claim cannot be verified from the retrieved context, explicitly say:

"I cannot verify this from the retrieved code."

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

    # -------------------------
    # Ask LLM
    # -------------------------
    answer = ask_llm(prompt)

    # -------------------------
    # Response
    # -------------------------
    return {
        "answer": answer,
        "sources": [
            {
                "file": item["chunk"].file.path,
                "chunk": item["chunk"].chunk_name,
                "chunk_type": item["chunk"].chunk_type,
                "distance": round(item["distance"], 4),
                "content": item["chunk"].content[:1000]
            }
            for item in results
        ]
    }