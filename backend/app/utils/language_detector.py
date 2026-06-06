EXTENSION_MAP = {
    ".py": "Python",
    ".js": "JavaScript",
    ".ts": "TypeScript",
    ".java": "Java",
    ".cpp": "C++",
    ".c": "C",
    ".cs": "C#",
    ".rb": "Ruby",
    ".go": "Go",
    ".php": "PHP",
    ".jsx": "JavaScript",
    ".tsx": "TypeScript",
    ".rs": "Rust",
    ".swift": "Swift",
}

def detect_language(filepath: str):

    for ext, lang in EXTENSION_MAP.items():
        if filepath.endswith(ext):
            return lang
    return "Unknown"