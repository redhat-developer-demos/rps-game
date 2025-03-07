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

@component(base_image="python:3.11", packages_to_install=["roboflow==1.1.54"])
def fetch_data(
    dataset: Output[Dataset]
):
    """
    Fetches dataset from Roboflow
    """
    from roboflow import Roboflow
    import os
    import shutil

    API_KEY = os.environ.get("API_KEY")

    os.chdir("/tmp")
    
    # Initialize Roboflow and download dataset
    rf = Roboflow(api_key=API_KEY)
    project = rf.workspace("roboflow-58fyf").project("rock-paper-scissors-sxsw")
    version = project.version(14)
    data = version.download("yolov11")
    shutil.move(data.location, dataset.path)
