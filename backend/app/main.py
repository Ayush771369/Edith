from fastapi import FastAPI #type: ignore
from app.core.database import engine, Base #type: ignore
from app.models.repository import Repository #type: ignore
from app.api.routes import repository #type: ignore
from app.models.files import File #type: ignore
from app.api.routes import parser #type: ignore
from app.models.parsed_entity import ParsedEntity #type: ignore
from app.models.code_chunk import CodeChunk #type: ignore
from app.api.routes import search #type: ignore
from app.api.routes import chat #type: ignore
from fastapi.middleware.cors import CORSMiddleware #type: ignore


Base.metadata.create_all(bind=engine) # Create database tables



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    repository.router,
    prefix="/repositories",
    tags=["repositories"]
)

app.include_router(
    parser.router,
    prefix="/repositories",
    tags=["parser"]
)

app.include_router(
    search.router,
    prefix="/search",
    tags=["search"]
)

app.include_router(
    chat.router,
    prefix="/chat",
    tags=["chat"]
)


@app.get("/")
async def root():
    return {"message": "Edith is alive!"}