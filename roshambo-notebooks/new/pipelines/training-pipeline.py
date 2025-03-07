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
from fetch_data import fetch_data
from train_model import train_model


# Misc imports
import os

data_connection_secret_name = 'aws-connection-my-storage'
roboflow = 'roboflow'

# Create pipeline
@dsl.pipeline(
  name='training-pipeline',
  description='We train an amazing model 🚂'
)

def training_pipeline(model_name: str):
    fetch_data_task = fetch_data()

    #train_model_task = train_model()
    kubernetes.use_secret_as_env(
        fetch_data_task,
        secret_name=roboflow,
        secret_key_to_env={
            'API_KEY': 'API_KEY',
        },
    )
    
    train_model_task = train_model(dataset = fetch_data_task.outputs["dataset"])


if __name__ == '__main__':

    metadata = {
        "model_name": "yolov11",
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
        experiment_name="training",
        arguments=metadata,
        enable_caching=False
    )