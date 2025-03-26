import kfp
import kfp.dsl as dsl
from kfp.dsl import (
    component,
    Input,
    Output,
    Dataset,
    Metrics,
    Model,
    Artifact,
)

@component(base_image="python:3.11", packages_to_install=["GitPython"])
def fetch_data_from_git(
    dataset: Output[Dataset]
):
    from git import Repo
    import shutil
    import os

    os.chdir("/tmp")

    repo_url = "https://github.com/redhat-developer-demos/rps-game"
    to_path = "data"
    branch = "kubecon-eu-2025"
    Repo.clone_from(repo_url, to_path, branch=branch, depth=1)

    shutil.move("data/roshambo-notebooks/data", dataset.path)