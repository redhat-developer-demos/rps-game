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
    ClassificationMetrics
)

@component(base_image="quay.io/rh-aiservices-bu/rps:0.2")
def evaluate(
    dataset: Input[Dataset],
    model_artifact: Input[Model],
    metrics: Output[Metrics],
    classification_metrics: Output[ClassificationMetrics],
):
    from ultralytics import YOLO
    import numpy as np
    import shutil

    loc = "/tmp"
    shutil.move(dataset.path, loc)
    
    model = YOLO(model_artifact.path)
    results = model.val()

    cmatrix = results.confusion_matrix.matrix.tolist()
    class_names = list(results.names.values())
    classification_metrics.log_confusion_matrix(class_names + ["Background"], cmatrix)
    
    metrics.log_metric("Precision", float(np.mean(results.box.p)))
    metrics.log_metric("Recall", float(np.mean(results.box.r)))
    metrics.log_metric("map50-95", float(results.box.map))
    metrics.log_metric("map50", float(results.box.map50))
    metrics.log_metric("map75", float(results.box.map75))