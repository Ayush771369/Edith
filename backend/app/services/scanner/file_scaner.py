import os

IGNORE_DIRS = [
    '.git', 
    'node_modules', 
    '__pycache__',
    'venv',
    'env',
    'dist',
    'build',]

VALID_EXTENSIONS = ['.py', '.js', '.java', '.cpp', '.c', '.cs', '.rb', '.go', '.ts']


def scan_repository(repo_path: str):
    code_files = []
    for root, dirs, files in os.walk(repo_path):
        # Skip ignored directories
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
        
        for file in files:
            ext = os.path.splitext(file)[1]
            if ext in VALID_EXTENSIONS:
                file_path = os.path.join(root, file)
                code_files.append(file_path)
    
    return code_files