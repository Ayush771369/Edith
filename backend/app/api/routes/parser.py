from fastapi import APIRouter, Depends #type: ignore
from sqlalchemy.orm import Session #type: ignore

from app.core.dependencies import get_db #type: ignore
from app.models.repository import Repository #type: ignore
from app.models.files import File #type: ignore
from app.models.parsed_entity import ParsedEntity #type: ignore
from app.models.code_chunk import CodeChunk #type: ignore
from app.services.embeddings.embedding_service import generate_embedding #type: ignore
from app.services.chunking.chunk_repository import chunk_repository #type: ignore
from app.services.parsers.parse_repository import parse_repository as parse_repo_service #type: ignore
from app.services.embedding.embed_repository import embed_repository #type: ignore


from app.services.parser.python_parser import (parse_python_file, extract_classes, extract_functions) #type: ignore

router = APIRouter()


@router.get("/{repository_id}/parse")
def parse_repository_preview(
    repository_id: int,
    db: Session = Depends(get_db)
):

    file = (
        db.query(File)
        .filter(File.repository_id == repository_id)
        .first()
    )
    if not file:
        return {"error": "No files found for this repository"}

    tree, source = parse_python_file(file.path)
    classes = extract_classes(tree, source)
    functions = extract_functions(tree, source)

    return {"file": file.path, "classes": classes, "functions": functions}


@router.post("/{repository_id}/parse-all")

def parse_all(
    repository_id: int,
    db: Session = Depends(get_db)
):
    parsed_count = parse_repo_service(repository_id, db)

    return {
        "repository_id": repository_id,
        "entities_found": parsed_count
    }


@router.post("/{repository_id}/chunk-all")

def chunk_all(
    repository_id: int,
    db: Session = Depends(get_db)
):
    chunk_count = chunk_repository(repository_id, db)
    return {
        "repository_id": repository_id,
        "chunks_created": chunk_count
    }


@router.post("/{repository_id}/embed-all")

def embed_all(
    repository_id: int,
    db: Session = Depends(get_db)
):
    embedded_count = embed_repository(repository_id, db)

    return {
        "repository_id": repository_id,
        "chunks_embedded": embedded_count
    }