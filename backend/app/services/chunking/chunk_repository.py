from sqlalchemy.orm import Session # type: ignore

from app.models.files import File # type: ignore
from app.models.code_chunk import CodeChunk # type: ignore

from app.services.parser.python_parser import (
    parse_python_file,
    extract_classes as extract_python_classes,
    extract_functions as extract_python_functions
) # type: ignore
from app.services.parser.javascript_parser import (
    parse_javascript_file,
    extract_classes as extract_js_classes,
    extract_functions as extract_js_functions
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
    
    db.query(CodeChunk)\
    .filter(CodeChunk.repository_id == repository_id)\
    .delete(synchronize_session=False)

    db.commit()

    for file in files:
        if file.language not in ["Python", "JavaScript"]:
            continue

        try:
            if file.language == "Python":
                tree, code = parse_python_file(file.path)
                classes = extract_python_classes(tree, code)
                functions = extract_python_functions(tree, code)
            elif file.language == "JavaScript":
                tree, code = parse_javascript_file(file.path)
                classes = extract_js_classes(tree, code)
                functions = extract_js_functions(tree, code)

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