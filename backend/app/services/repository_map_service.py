from sqlalchemy.orm import Session #type: ignore
from typing import List, Dict
from fastapi import HTTPException # type: ignore
from app.models.files import File
from app.models.parsed_entity import ParsedEntity
from app.models.repository import Repository
from app.models.code_chunk import CodeChunk
from app.schemas.repository_map import EntityInfo, FileInfo, RepositoryMapResponse


def get_repository_map(repository_id: int, db: Session) -> RepositoryMapResponse:
    # 1. Get repository to validate and get name
    repository = db.query(Repository).filter(Repository.id == repository_id).first()
    if not repository:
        raise HTTPException(status_code=404, detail=f"Repository with id {repository_id} not found")

    # 2. Get all files for the repository in one query
    files = (
        db.query(File)
        .filter(File.repository_id == repository_id)
        .order_by(File.path)  # for consistent ordering
        .all()
    )

    # 3. Get all parsed_entities for these files in one query
    file_ids = [file.id for file in files]
    entities_by_file_id: Dict[int, List[ParsedEntity]] = {}
    if file_ids:
        parsed_entities = (
            db.query(ParsedEntity)
            .filter(ParsedEntity.file_id.in_(file_ids))
            .all()
        )
        # Group by file_id
        for entity in parsed_entities:
            entities_by_file_id.setdefault(entity.file_id, []).append(entity)

    # 3b. Get all code_chunks for the same files (or repository) in one query
    chunks_by_file_id: Dict[int, List[CodeChunk]] = {}
    if file_ids:
        code_chunks = (
            db.query(CodeChunk)
            .filter(CodeChunk.file_id.in_(file_ids))
            .all()
        )
        # Group by file_id for quick lookup
        for chunk in code_chunks:
            chunks_by_file_id.setdefault(chunk.file_id, []).append(chunk)

    # 4. Build the response
    file_infos: List[FileInfo] = []
    for file in files:
        # Get entities for this file, default to empty list
        file_entities = entities_by_file_id.get(file.id, [])
        # Get chunks for this file, default to empty list
        file_chunks = chunks_by_file_id.get(file.id, [])

        # Build a lookup map: (chunk_type, chunk_name, start_line, end_line) -> chunk.id
        chunk_lookup = {
            (chunk.chunk_type, chunk.chunk_name, chunk.start_line, chunk.end_line): chunk.id
            for chunk in file_chunks
        }

        entity_infos = [
            EntityInfo(
                type=entity.entity_type,
                name=entity.entity_name,
                start_line=entity.start_line,
                end_line=entity.end_line,
                id=chunk_lookup.get(
                    (entity.entity_type, entity.entity_name, entity.start_line, entity.end_line)
                )  # Assuming a match always exists; if not, id will be None (but schema expects int)
            )
            for entity in file_entities
        ]
        file_infos.append(
            FileInfo(
                path=file.path,
                language=file.language,
                entities=entity_infos
            )
        )

    return RepositoryMapResponse(
        repository_id=repository.id,
        repository_name=repository.name,
        files=file_infos
    )