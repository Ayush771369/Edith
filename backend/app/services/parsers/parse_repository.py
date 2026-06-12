from sqlalchemy.orm import Session  # type: ignore

from app.models.files import File  # type: ignore
from app.models.parsed_entity import ParsedEntity  # type: ignore

from app.services.parser.python_parser import (
    parse_python_file,
    extract_classes as extract_python_classes,
    extract_functions as extract_python_functions
)

from app.services.parser.javascript_parser import (
    parse_javascript_file,
    extract_classes as extract_js_classes,
    extract_functions as extract_js_functions
)

def parse_repository(
    repository_id: int,
    db: Session
):
    files = (
        db.query(File)
        .filter(File.repository_id == repository_id)
        .all()
    )
    file_ids = [file.id for file in files]

    if file_ids:
        db.query(ParsedEntity)\
           .filter(ParsedEntity.file_id.in_(file_ids))\
           .delete(synchronize_session=False)
        db.commit()

    parsed_count = 0

    for file in files:

        if file.language not in ["Python", "JavaScript"]:
            continue

        try:
            print(f"\nProcessing: {file.path}")
            print(f"Language: {file.language}")

            if file.language == "Python":
                tree, code = parse_python_file(file.path)

                classes = extract_python_classes(tree, code)
                functions = extract_python_functions(tree, code)

            elif file.language == "JavaScript":
                tree, code = parse_javascript_file(file.path)

                classes = extract_js_classes(tree, code)
                functions = extract_js_functions(tree, code)

            print(
                f"Found {len(classes)} classes "
                f"and {len(functions)} functions"
            )

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

    print(f"\nTotal parsed entities: {parsed_count}")

    return parsed_count