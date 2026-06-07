from sqlalchemy.orm import Session  # type: ignore

from app.models.code_chunk import CodeChunk  # type: ignore
from app.services.embeddings.embedding_service import generate_embedding  # type: ignore


def hybrid_search(
    repository_id: int,
    query: str,
    db: Session,
    limit: int = 10
):
    query_embedding = generate_embedding(query)

    distance_expr = (
        CodeChunk.embedding.cosine_distance(
            query_embedding
        )
    )

    # -------------------------
    # Vector Search
    # -------------------------
    vector_results = (
        db.query(
            CodeChunk,
            distance_expr.label("distance")
        )
        .filter(
            CodeChunk.repository_id == repository_id
        )
        .order_by(distance_expr)
        .limit(15)
        .all()
    )

    # -------------------------
    # Exact Name Matches
    # -------------------------
    exact_matches = (
        db.query(CodeChunk)
        .filter(
            CodeChunk.repository_id == repository_id,
            CodeChunk.chunk_name.ilike(query)
        )
        .all()
    )

    # -------------------------
    # Partial Name Matches
    # -------------------------
    partial_matches = (
        db.query(CodeChunk)
        .filter(
            CodeChunk.repository_id == repository_id,
            CodeChunk.chunk_name.ilike(f"%{query}%")
        )
        .all()
    )

    # -------------------------
    # Ranking
    # -------------------------
    combined = {}

    # Vector results
    for chunk, dist in vector_results:

        score = 100 - (float(dist) * 100)

        # Penalize tests
        if "/tests/" in chunk.file.path:
            score -= 50

        combined[chunk.id] = {
            "chunk": chunk,
            "distance": float(dist),
            "score": score
        }

    # Exact match boost
    for chunk in exact_matches:

        if chunk.id not in combined:

            score = 200

            if "/tests/" in chunk.file.path:
                score -= 50

            combined[chunk.id] = {
                "chunk": chunk,
                "distance": 0.0,
                "score": score
            }

        else:
            combined[chunk.id]["score"] += 200

    # Partial match boost
    for chunk in partial_matches:

        if chunk.id not in combined:

            score = 100

            if "/tests/" in chunk.file.path:
                score -= 50

            combined[chunk.id] = {
                "chunk": chunk,
                "distance": 0.0,
                "score": score
            }

        else:
            combined[chunk.id]["score"] += 100

    # -------------------------
    # Sort
    # -------------------------
    ranked_results = sorted(
        combined.values(),
        key=lambda x: x["score"],
        reverse=True
    )

    return ranked_results[:limit]