from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.core.dependencies import get_db # type: ignore
from app.models.code_chunk import CodeChunk # type: ignore
from app.services.embeddings.embedding_service import generate_embedding # type: ignore
from app.schemas.search import SearchRequest # type: ignore

router = APIRouter()


@router.post("")
def semantic_search(
    payload: SearchRequest,
    db: Session = Depends(get_db)
):
    query_embedding = generate_embedding(payload.query)

    distance = CodeChunk.embedding.cosine_distance(query_embedding)

    results = (
        db.query(CodeChunk, distance.label("distance"))
        .filter(CodeChunk.repository_id == payload.repository_id)
        .order_by(distance)
        .limit(5)
        .all()
    )
    
    return [
        {
            "chunk_name": chunk.chunk_name,
            "chunk_type": chunk.chunk_type,
            "file_path": chunk.file.path,
            "preview": chunk.content[:300],
            "start_line": chunk.start_line,
            "end_line": chunk.end_line,
            "distance": round(float(distance), 4)
        }
        for chunk, distance in results
    ]