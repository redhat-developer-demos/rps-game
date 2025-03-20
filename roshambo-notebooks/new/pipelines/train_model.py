import kfp
import kfp.dsl as dsl
from kfp.dsl import (
    component,
    Input,
    Output,
    Dataset,
    Model,
)


@component(base_image="quay.io/rh-aiservices-bu/rps:0.2")
def train_model(
    dataset: Input[Dataset],
    pt_model: Output[Model],
    onnx_model: Output[Model],
):

    import os
    import shutil
    import requests
    from tqdm import tqdm
    import subprocess
    import requests
    from ultralytics import YOLO
    def _download_file(url, destination_path):
        """Download a file and save it to the destination path."""
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            total_size = int(response.headers.get("content-length", 0))
            block_size = 1024  # 1 KB
            t = tqdm(total=total_size, unit="iB", unit_scale=True)
            with open(destination_path, "wb") as file:
                for chunk in response.iter_content(block_size):
                    t.update(len(chunk))
                    file.write(chunk)
            t.close()
            print(f"Downloaded: {destination_path}")
        else:
            raise Exception(f"Failed to download {url}, status code: {response.status_code}")

    # Define S3 storage URL
    s3_bucket = "https://kubecon-rps.s3.us-west-2.amazonaws.com"
    pretrained_models = {
        "yolo-rps-v2.pt": f"{s3_bucket}/yolo-rps-v2.pt",
        "yolo-rps-v2.onnx": f"{s3_bucket}/yolo-rps-v2.onnx",
    }

    # Ensure local directory for downloads
    local_dir = "/tmp/pretrained_models"
    os.makedirs(local_dir, exist_ok=True)

    # Download models
    model_paths = {}
    for model_name, model_url in pretrained_models.items():
        local_model_path = os.path.join(local_dir, model_name)
        _download_file(model_url, local_model_path)
        model_paths[model_name] = local_model_path

    # Ensure model artifact directory exists
    # os.makedirs(os.path.dirname(model_artifact.path), exist_ok=True)

    # Move files to the final artifact location
    pt_model.path += ".pt"
    shutil.move(model_paths["yolo-rps-v2.pt"], pt_model.path)

    onnx_model.path += ".onnx"
    shutil.move(model_paths["yolo-rps-v2.onnx"], onnx_model.path)