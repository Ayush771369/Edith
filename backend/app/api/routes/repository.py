from fastapi import APIRouter, Depends #type: ignore
from sqlalchemy.orm import Session #type: ignore
import os

from app.models.files import File #type: ignore
from app.utils.language_detector import detect_language #type: ignore

from app.core.dependencies import get_db #type: ignore
from app.models.repository import Repository #type: ignore
from app.schemas.repository import RepositoryCreate, RepositoryResponse #type: ignore

from app.services.github.clone_repo import clone_repo #type: ignore
from app.services.scanner.file_scaner import scan_repository #type: ignore

from app.services.parsers.parse_repository import parse_repository #type: ignore
from app.services.chunking.chunk_repository import chunk_repository #type: ignore
from app.services.embedding.embed_repository import embed_repository #type: ignore


router = APIRouter()

@router.post("/analyze")
async def analyze_repository(
    payload: RepositoryCreate,
    db: Session = Depends(get_db)
):
    
    existing_repo = (
        db.query(Repository)
        .filter(Repository.github_url == payload.github_url)
        .first()
    )

    if existing_repo:
        return {
            "repository_id": existing_repo.id,
            "repository_name": existing_repo.name,
            "files_found": db.query(File).filter(File.repository_id == existing_repo.id).count(),
            "status": "Repository already exists"
        }

    # Step 1: Clone the repository
    repo_name, local_path = clone_repo(payload.github_url) # This will clone the repo and return the local path

    if not os.path.exists(local_path):
        raise Exception(f"Failed to clone repository from {local_path}")

    print(f"Repository cloned to: {local_path}")
    print("Exists:", os.path.exists(local_path))


    repository = Repository(
        name=payload.github_url.split("/")[-1],
        github_url=payload.github_url,
        local_path=local_path,
        status="scanned"
    )
    db.add(repository)
    db.commit()
    db.refresh(repository)

    files = scan_repository(local_path) # This will scan the cloned repository and return a list of code files found

    for filepath in files:
        file_record = File(
            repository_id=repository.id,
            path=filepath,
            language=detect_language(filepath),
            size=os.path.getsize(filepath)
        )
        db.add(file_record)
    db.commit()

    print(f"Files found: {len(files)}")
    print(files[:5])

    parsed_count = parse_repository(repository.id, db)

    chunk_count = chunk_repository(repository.id, db)

    embedded_count = embed_repository(repository.id, db, limit=100000)

    # Step 2: Create a new Repository record in the database
    

    return {
    "repository_id": repository.id,
    "repository_name": repository.name,
    "files_found": len(files),
    "parsed_entities": parsed_count,
    "chunks": chunk_count,
    "embeddings": embedded_count,
    "status": "ready"
}

    