from sqlalchemy.orm import Session # type: ignore

from app.models.code_chunk import CodeChunk # type: ignore
from app.services.embeddings.embedding_service import generate_embedding # type: ignore


def embed_repository(
    repository_id: int,
    db: Session,
    limit: int = 500
):
    code_chunks = (
        db.query(CodeChunk)
        .filter(
            CodeChunk.repository_id == repository_id,
            CodeChunk.embedding == None
        )
        .limit(limit)
        .all()
    )

    embedded_count = 0

    for chunk in code_chunks:

        if chunk.embedding is not None:
            continue

        try:
            chunk.embedding = generate_embedding(
                chunk.content[:6000]
            )

            embedded_count += 1

        except Exception as e:
            print(
                f"Failed embedding chunk: {chunk.chunk_name}"
            )
            print(e)

    db.commit()

    return embedded_count