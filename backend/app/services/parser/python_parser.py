from tree_sitter import Language, Parser #type: ignore
import tree_sitter_python  #type: ignore

PY_LANGUAGE = Language(tree_sitter_python.language()) 

parser = Parser()
parser.language = PY_LANGUAGE

def parse_python_file(filepath: str):
    with open(filepath, "r", encoding="utf-8") as f:
        code = f.read()
    tree = parser.parse(bytes(code, "utf8"))
    return tree, code

def extract_classes(tree, code):
    classes = []
    root = tree.root_node
    stack = [root]
    while stack:
        node = stack.pop()
        if node.type == "class_definition":
            name_node = node.child_by_field_name("name")
            if name_node:
                class_name = code[name_node.start_byte:name_node.end_byte]
                class_code = code[node.start_byte:node.end_byte]
                classes.append({
                    "name": class_name,
                    "start_line": node.start_point[0] + 1,
                    "end_line": node.end_point[0] + 1,
                    "content": class_code
                })

        stack.extend(node.children)
    return classes


def extract_functions(tree, code):
    functions = []
    root = tree.root_node
    stack = [root]
    while stack:
        node = stack.pop()
        if node.type == "function_definition":
            name_node = node.child_by_field_name("name")
            if name_node:
                function_name = code[name_node.start_byte:name_node.end_byte]
                function_code = code[node.start_byte:node.end_byte]
                functions.append({
                    "name": function_name,
                    "start_line": node.start_point[0] + 1,
                    "end_line": node.end_point[0] + 1,
                    "content": function_code
                })

        stack.extend(node.children)
    return functions