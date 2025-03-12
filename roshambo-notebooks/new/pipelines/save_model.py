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

@component(base_image='python:3.9', packages_to_install=['pip==24.2', 'setuptools==74.1.3', 'boto3==1.36.12', 'model-registry==0.2.9'])
def register_model(
    model_name: str,
    model: Input[Model],
    metrics: Input[Metrics],
    version: str = "",
):
    from os import environ, path, makedirs
    from datetime import datetime
    from model_registry import ModelRegistry, utils
    import shutil
    import json
    from boto3 import client

    ############ Upload to S3 ############
    model_object_prefix = model_name if model_name else "model"
    s3_endpoint_url = environ.get('AWS_S3_ENDPOINT')
    s3_access_key = environ.get('AWS_ACCESS_KEY_ID')
    s3_secret_key = environ.get('AWS_SECRET_ACCESS_KEY')
    s3_bucket_name = environ.get('AWS_S3_BUCKET')
    s3_region = environ.get('AWS_DEFAULT_REGION')
    version = version if version else datetime.now().strftime('%y%m%d%H%M')

    s3_client = client(
        "s3",
        aws_access_key_id=s3_access_key,
        aws_secret_access_key=s3_secret_key,
        endpoint_url=s3_endpoint_url,
    )

    def _generate_artifact_name(artifact_file_name, version=''):
        artifact_name, artifact_extension = path.splitext(path.basename(artifact_file_name))
        artifact_version_file_name = f'{artifact_name}-{version}{artifact_extension}'
        print(f"Artifact File Name: {artifact_version_file_name}")
        return artifact_version_file_name


    def _do_upload(s3_client, model_path, object_name, s3_bucket_name):
        print(f'Uploading model to {object_name}')
        try:
            s3_client.upload_file(model_path, s3_bucket_name, object_name)
        except Exception as e:
            print(f'S3 upload to bucket {s3_bucket_name} at {s3_endpoint_url} failed: {e}')
            raise
        print(f'Model uploaded and available as "{object_name}"')

    model_artifact_s3_path = f"/models/{model_object_prefix}/1/{_generate_artifact_name(f'{model_object_prefix}.pt', version)}"
    _do_upload(s3_client, model.path, model_artifact_s3_path, s3_bucket_name)

    ############ Register to Model Registry ############
    environ["KF_PIPELINES_SA_TOKEN_PATH"] = "/var/run/secrets/kubernetes.io/serviceaccount/token"

    # Save to Model Registry
    namespace_file_path =\
        '/var/run/secrets/kubernetes.io/serviceaccount/namespace'
    with open(namespace_file_path, 'r') as namespace_file:
        namespace = namespace_file.read()

    #server_address = f"https://{namespace}-registry-rest.{cluster_domain}"
    server_address = "https://registry-rest.apps.prod.rhoai.rh-aiservices-bu.com"

    registry = ModelRegistry(
        server_address=server_address, 
        port=443,
        author=namespace,
        is_secure=False
    )
    registered_model_name = model_object_prefix
    version_name = version
    metadata = {key : str(value) for key, value in metrics.metadata.items() if key not in ["display_name", "store_session_info"]} 
    s3_path = f"s3://{s3_endpoint_url.split('https://')[-1]}{model_artifact_s3_path}"
    s3_path_updated_format = utils.s3_uri_from(model_artifact_s3_path,
                                               bucket=s3_bucket_name,
                                               endpoint=s3_endpoint_url,
                                               region=s3_region)
    
    registry.register_model(
        registered_model_name,
        s3_path_updated_format,
        model_format_name="pt",
        model_format_version="1",
        version=version_name,
        description=f"{registered_model_name} is the best yolo model there ever was.",
        metadata=metadata
    )
    print("Model registered successfully")