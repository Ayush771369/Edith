import os
from git import Repo # type: ignore

BASE_DIR = "repositories"

def clone_repo(github_url: str):
    repo_name = github_url.split("/")[-1].replace(".git", "")
    local_path = os.path.join(BASE_DIR, repo_name)

    if not os.path.exists(BASE_DIR):
        os.makedirs(BASE_DIR)

    if not os.path.exists(local_path):
        print(f"Cloning repository from {github_url} -> {local_path}")
        Repo.clone_from(github_url, local_path)

    print(f"Exists after clone: {os.path.exists(local_path)}")

    return repo_name, local_path