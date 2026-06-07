from fastapi import APIRouter, Depends # type: ignore
from sqlalchemy.orm import Session # type: ignore

from app.core.dependencies import get_db # type: ignore
from app.schemas.search import SearchRequest # type: ignore
from app.services.search.hybrid_search import hybrid_search # type: ignore

router = APIRouter()


@router.post("")
def semantic_search(
    payload: SearchRequest,
    db: Session = Depends(get_db)
):
    results = hybrid_search(
        repository_id=payload.repository_id,
        query=payload.query,
        db=db,
        limit=10
    )

    return [
        {
            "chunk_name": item["chunk"].chunk_name,
            "chunk_type": item["chunk"].chunk_type,
            "file_path": item["chunk"].file.path,
            "preview": item["chunk"].content[:300],
            "start_line": item["chunk"].start_line,
            "end_line": item["chunk"].end_line,
            "distance": round(
                item["distance"],
                4
            )
        }
        for item in results
    ]