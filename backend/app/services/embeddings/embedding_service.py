import requests # type: ignore

def generate_embedding(text: str):

    text = text[:6000]
    response = requests.post(
        "http://host.docker.internal:11434/api/embeddings",
        json={
            "model": "nomic-embed-text",
            "prompt": text
        }
    )
    response.raise_for_status()

    return response.json()["embedding"]