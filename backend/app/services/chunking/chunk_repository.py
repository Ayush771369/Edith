from sqlalchemy.orm import Session # type: ignore

from app.models.files import File # type: ignore
from app.models.code_chunk import CodeChunk # type: ignore

from app.services.parser.python_parser import (
    parse_python_file,
    extract_classes,
    extract_functions
) # type: ignore


def chunk_repository(
    repository_id: int,
    db: Session
):
    files = (
        db.query(File)
        .filter(File.repository_id == repository_id)
        .all()
    )

    chunk_count = 0

    for file in files:
        if file.language != "Python":
            continue

        try:
            tree, source = parse_python_file(file.path)

            classes = extract_classes(tree, source)
            functions = extract_functions(tree, source)

            for cls in classes:
                db.add(
                    CodeChunk(
                        file_id=file.id,
                        repository_id=file.repository_id,
                        chunk_type="class",
                        chunk_name=cls["name"],
                        language=file.language,
                        start_line=cls["start_line"],
                        end_line=cls["end_line"],
                        content=cls["content"]
                    )
                )
                chunk_count += 1

            for func in functions:
                db.add(
                    CodeChunk(
                        file_id=file.id,
                        repository_id=file.repository_id,
                        chunk_type="function",
                        chunk_name=func["name"],
                        language=file.language,
                        start_line=func["start_line"],
                        end_line=func["end_line"],
                        content=func["content"]
                    )
                )
                chunk_count += 1

        except Exception as e:
            print(f"Error chunking {file.path}: {e}")

    db.commit()

    return chunk_count