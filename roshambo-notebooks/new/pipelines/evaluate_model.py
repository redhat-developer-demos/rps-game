import kfp
import kfp.dsl as dsl
from kfp.dsl import (
    component,
    Input,
    Output,
    Dataset,
    Metrics,
    ClassificationMetrics,
    Model,
)


@component(base_image="quay.io/rh-aiservices-bu/rps:0.2")
def evaluate(
    dataset: Input[Dataset],
    model_artifact: Input[Model],  # Only .pt model
    metrics: Output[Metrics],
    classification_metrics: Output[ClassificationMetrics],
):
    """
    Evaluates the YOLOv11 model using a dataset and logs metrics.
    """

    import os
    import shutil
    import numpy as np
    from ultralytics import YOLO
    # Create a working directory
    loc = "/tmp"
    os.makedirs(loc, exist_ok=True)
    
    # Move dataset to working directory
    dataset_path = os.path.join(loc, "dataset")
    shutil.move(dataset.path, dataset_path)
    # os.chdir(loc)
    # print("Current dir: ", os.getcwd())
    
    # Model path (ensuring it's a .pt file)
    model_path = model_artifact.path
    if not model_path.endswith(".pt"):
        raise ValueError(f"Expected a .pt model but got: {model_path}")
    
    # Load YOLO model
    print(f"Loading YOLO model from {model_path}")
    model = YOLO(model_path)

    # Run validation
    print("Running validation...")
    results = model.val(data=os.path.join(dataset_path, "data.yaml"))

    # Extract metrics
    cmatrix = results.confusion_matrix.matrix.tolist()
    class_names = list(results.names.values())
    
    classification_metrics.log_confusion_matrix(class_names + ["Background"], cmatrix)
    metrics.log_metric("Precision", float(np.mean(results.box.p)))
    metrics.log_metric("Recall", float(np.mean(results.box.r)))
    metrics.log_metric("map50-95", float(results.box.map))
    metrics.log_metric("map50", float(results.box.map50))
    metrics.log_metric("map75", float(results.box.map75))

    print("Evaluation completed successfully.")
