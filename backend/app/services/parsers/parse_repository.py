from sqlalchemy.orm import Session # type: ignore

from app.models.files import File # type: ignore
from app.models.parsed_entity import ParsedEntity # type: ignore

from app.services.parser.python_parser import (
    parse_python_file,
    extract_classes,
    extract_functions
) # type: ignore


def parse_repository(
    repository_id: int,
    db: Session
):
    files = (
        db.query(File)
        .filter(File.repository_id == repository_id)
        .all()
    )

    parsed_count = 0

    for file in files:
        if file.language != "Python":
            continue

        try:
            tree, source = parse_python_file(file.path)

            classes = extract_classes(tree, source)
            functions = extract_functions(tree, source)

            for cls in classes:
                db.add(
                    ParsedEntity(
                        file_id=file.id,
                        entity_type="class",
                        entity_name=cls["name"],
                        start_line=cls["start_line"],
                        end_line=cls["end_line"]
                    )
                )
                parsed_count += 1

            for func in functions:
                db.add(
                    ParsedEntity(
                        file_id=file.id,
                        entity_type="function",
                        entity_name=func["name"],
                        start_line=func["start_line"],
                        end_line=func["end_line"]
                    )
                )
                parsed_count += 1

        except Exception as e:
            print(f"Error parsing {file.path}: {e}")

    db.commit()

    return parsed_count