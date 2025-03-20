# kfp imports
import kfp
import kfp.dsl as dsl
from kfp.dsl import (
    component,
    Input,
    Output,
    Dataset,
    Metrics,
)
from kfp import kubernetes
from fetch_data import fetch_data_from_git
from train_model import train_model
from evaluate_model import evaluate
from save_model import register_model


# Misc imports
import os

data_connection_secret_name = 'aws-connection-my-storage'
#roboflow = 'roboflow'

# Create pipeline
@dsl.pipeline(
  name='training-pipeline',
  description='We train an amazing rock paper scissors YOLO model 🚂'
)
def training_pipeline(model_name: str, user: str, version: str):
    fetch_data_task = fetch_data_from_git()

    train_model_task = train_model(
        dataset=fetch_data_task.outputs["dataset"],
    ).set_memory_limit('24Gi')

    evaluate_task = evaluate(
        dataset=fetch_data_task.outputs["dataset"],
        model_artifact=train_model_task.outputs["pt_model"],
    )

    register_model_task = register_model(
        model_name=model_name,
        model=train_model_task.outputs["onnx_model"],
        metrics=evaluate_task.outputs["metrics"],
        user=user,
        version=version,
        
    )
    kubernetes.use_secret_as_env(
        register_model_task,
        secret_name=data_connection_secret_name,
        secret_key_to_env={
            'AWS_S3_ENDPOINT': 'AWS_S3_ENDPOINT',
            'AWS_ACCESS_KEY_ID': 'AWS_ACCESS_KEY_ID',
            'AWS_SECRET_ACCESS_KEY': 'AWS_SECRET_ACCESS_KEY',
            'AWS_S3_BUCKET': 'AWS_S3_BUCKET',
            'AWS_DEFAULT_REGION': 'AWS_DEFAULT_REGION',
        },
    )

if __name__ == '__main__':
    metadata = {
        "model_name": "yolov11",
        "version": "v2",
        "user": "user5"
    }
    namespace_file_path =\
        '/var/run/secrets/kubernetes.io/serviceaccount/namespace'
    with open(namespace_file_path, 'r') as namespace_file:
        namespace = namespace_file.read()

    kubeflow_endpoint =\
        f'https://ds-pipeline-dspa.{namespace}.svc:8443'

    sa_token_file_path = '/var/run/secrets/kubernetes.io/serviceaccount/token'
    with open(sa_token_file_path, 'r') as token_file:
        bearer_token = token_file.read()

    ssl_ca_cert =\
        '/var/run/secrets/kubernetes.io/serviceaccount/service-ca.crt'

    print(f'Connecting to Data Science Pipelines: {kubeflow_endpoint}')
    client = kfp.Client(
        host=kubeflow_endpoint,
        existing_token=bearer_token,
        ssl_ca_cert=ssl_ca_cert
    )

    client.create_run_from_pipeline_func(
        training_pipeline,
        experiment_name="kfp-training",
        arguments=metadata,
        enable_caching=False
    )