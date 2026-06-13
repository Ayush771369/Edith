# Edith

> AI-powered Repository Intelligence Platform for understanding, exploring, searching, and chatting with codebases.

Edith helps developers analyze GitHub repositories by converting source code into a structured knowledge base that supports repository exploration, semantic search, and natural language interactions.

---

## Features

### Repository Analysis

* Clone and analyze public GitHub repositories
* Automatic repository indexing pipeline
* File scanning and language detection

### Code Parsing

* Python support via Tree-sitter
* JavaScript support via Tree-sitter
* Extracts:

  * Classes
  * Functions
  * Metadata (file paths, line numbers)

### Chunking & Embeddings

* Converts parsed entities into semantic code chunks
* Generates vector embeddings using Ollama + Nomic Embed
* Stores embeddings in ChromaDB for retrieval

### Repository Explorer

* Interactive repository tree view
* Browse:

  * Folders
  * Files
  * Classes
  * Functions
* Dynamic repository mapping powered by backend APIs

### Semantic Search

* Search code using natural language
* Retrieve relevant functions and classes by meaning rather than keywords
* Vector similarity search using embeddings

### Repository Chat

* Ask questions about a repository in plain English
* Context-aware responses generated from indexed code
* Retrieval-Augmented Generation (RAG) pipeline

---

## Architecture

```text
GitHub Repository
        │
        ▼
   Repository Scan
        │
        ▼
   Language Detection
        │
        ▼
      Parsing
        │
        ▼
     Chunking
        │
        ▼
    Embeddings
        │
        ▼
     ChromaDB
        │
 ┌──────┴──────┐
 ▼             ▼
Search       Chat
```

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Zustand
* Tailwind CSS

### Backend

* FastAPI
* SQLAlchemy
* PostgreSQL

### AI / Search

* ChromaDB
* Ollama
* Nomic Embed Text

### Parsing

* Tree-sitter Python
* Tree-sitter JavaScript

### Infrastructure

* Docker
* Docker Compose

---

## Current Workflow

1. Analyze a GitHub repository
2. Scan source files
3. Parse classes and functions
4. Create code chunks
5. Generate embeddings
6. Store vectors in ChromaDB
7. Explore repository structure
8. Search code semantically
9. Chat with the repository

---

## Example Use Cases

### Repository Exploration

Browse the structure of a codebase and inspect extracted classes and functions.

### Semantic Search

Search queries such as:

```text
function that retrieves verses
```

```text
API endpoint for chat requests
```

```text
vector database initialization
```

### Repository Chat

Ask questions like:

```text
How does the authentication flow work?
```

```text
Which function retrieves data from the vector database?
```

```text
Explain the architecture of this repository.
```

---

## Roadmap

### Completed

* Repository ingestion
* Parsing pipeline
* Chunk generation
* Embedding generation
* Semantic search
* Repository chat
* Repository explorer

### In Progress

* Source code viewer
* Entity-to-code navigation
* Repository statistics API

### Planned

* TypeScript parser
* Call graph generation
* Go-to-definition support
* Cross-file dependency analysis
* Multi-repository search
* Advanced repository insights

---

## Author

**Ayush Varun**
Chemical Engineering Undergraduate, IIT Indore

Building developer tools, AI systems, and repository intelligence platforms.
