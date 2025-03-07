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

# @component(base_image="python:3.11", packages_to_install=[ "ultralytics<=8.3.40", "supervision==0.25.1", "roboflow==1.1.54", "opencv-python==4.11.0.86"])
@component(base_image="python:3.11")
def train_model(
    dataset: Input[Dataset]
):
    import shutil
    import subprocess
    print("hello")

    loc = "/tmp"
    shutil.move(dataset.path, loc)
    subprocess.run(["ls", "-l", "/tmp"])
    subprocess.run(["ls", "-l", "/tmp/dataset"])
    
    