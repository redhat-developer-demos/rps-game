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

@component(base_image="quay.io/rh-aiservices-bu/rps:0.2")
def train_model(
    dataset: Input[Dataset],
    model_artifact: Output[Model]
):
    import shutil
    import subprocess
    import os
    import requests
    from ultralytics import YOLO

    loc = "/tmp"
    shutil.move(dataset.path, loc)

    subprocess.run(["ls", "-l", "/tmp"])
    subprocess.run(["ls", "-l", "/tmp/dataset"])

    dataset_location = os.path.join(loc, "dataset")

    url = "https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11s.pt"

    yolov11_orig_file_path = os.path.join(dataset_location, os.path.basename(url))

    # Download the file
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(yolov11_orig_file_path, "wb") as file:
            for chunk in response.iter_content(chunk_size=1024):
                file.write(chunk)
        print(f"Downloaded successfully: {yolov11_orig_file_path}")
    else:
        print(f"Failed to download file, status code: {response.status_code}")

    dataset_path = f"{dataset_location}/data.yaml"
    
    # Load the Yolov11 Original Pretrained Model
    model = YOLO(yolov11_orig_file_path)
    
    # Number of epochs to Train
    epochs = 1
    
    # Train the model
    results = model.train(
        data=dataset_path,
        epochs=epochs,
        imgsz=640,
        plots=True,
        exist_ok=True,
    )

    model_artifact.path += ".pt"
    shutil.move("runs/detect/train/weights/best.pt", model_artifact.path)