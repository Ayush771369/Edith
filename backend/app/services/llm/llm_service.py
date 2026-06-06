import requests # type: ignore

def ask_llm(prompt: str):

    response = requests.post(
        "http://host.docker.internal:11434/api/generate",
        json={
            "model": "qwen3:8b",
            "prompt": prompt,
            "stream": False
        }
    )

    print(response.status_code, response.text)
    response.raise_for_status()

    return response.json()["response"]