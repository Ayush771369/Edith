from tree_sitter import Language, Parser #type: ignore
import tree_sitter_javascript  #type: ignore

JS_LANGUAGE = Language(tree_sitter_javascript.language())

parser = Parser()
parser.language = JS_LANGUAGE

def parse_javascript_file(filepath: str):
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
        if node.type == "class_declaration":
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
    seen = set()
    root = tree.root_node
    stack = [root]
    while stack:
        node = stack.pop()
        if node.type == "function_declaration":
            name_node = node.child_by_field_name("name")
            if name_node:
                function_name = code[name_node.start_byte:name_node.end_byte]
                function_code = code[node.start_byte:node.end_byte]
                if function_name in seen:
                    continue
                seen.add(function_name)
                functions.append({
                    "name": function_name,
                    "start_line": node.start_point[0] + 1,
                    "end_line": node.end_point[0] + 1,
                    "content": function_code
                })
        if node.type == "variable_declarator":
            name_node = node.child_by_field_name("name")
            value_node = node.child_by_field_name("value")
            if name_node and value_node and value_node.type in ["function", "arrow_function"]:
                function_name = code[name_node.start_byte:name_node.end_byte]
                function_code = code[node.start_byte:node.end_byte]
                if function_name in seen:
                    continue
                seen.add(function_name)
                functions.append({
                    "name": function_name,
                    "start_line": node.start_point[0] + 1,
                    "end_line": node.end_point[0] + 1,
                    "content": function_code
                })
        stack.extend(node.children)
    return functions