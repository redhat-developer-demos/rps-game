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
    user: str,
    version: str,
):
    from os import environ, path
    from model_registry import ModelRegistry, utils, exceptions
    from boto3 import client

    ############ Upload to S3 ############
    model_object_prefix = f"{user}-yolo-rps-{version}"  # Ensures correct format
    s3_endpoint_url = environ.get('AWS_S3_ENDPOINT')
    s3_access_key = environ.get('AWS_ACCESS_KEY_ID')
    s3_secret_key = environ.get('AWS_SECRET_ACCESS_KEY')
    s3_bucket_name = environ.get('AWS_S3_BUCKET')
    s3_region = environ.get('AWS_DEFAULT_REGION')

    s3_client = client(
        "s3",
        aws_access_key_id=s3_access_key,
        aws_secret_access_key=s3_secret_key,
        endpoint_url=s3_endpoint_url,
    )

    def _generate_artifact_name(artifact_file_name):
        artifact_name, artifact_extension = path.splitext(path.basename(artifact_file_name))
        return f"{artifact_name}{artifact_extension}"  # Removes duplicate -v2

    def _do_upload(s3_client, model_path, object_name, s3_bucket_name):
        print(f'Uploading model to {object_name}')
        try:
            s3_client.upload_file(model_path, s3_bucket_name, object_name)
        except Exception as e:
            print(f'S3 upload failed: {e}')
            raise
        print(f'Model uploaded to "{object_name}"')

    # Corrected S3 path
    model_artifact_s3_path = f"models/{model_object_prefix}/1/{_generate_artifact_name(f'{model_object_prefix}.pt')}"
    _do_upload(s3_client, model.path, model_artifact_s3_path, s3_bucket_name)

    ############ Register to Model Registry ############
    environ["KF_PIPELINES_SA_TOKEN_PATH"] = "/var/run/secrets/kubernetes.io/serviceaccount/token"

    namespace_file_path = '/var/run/secrets/kubernetes.io/serviceaccount/namespace'
    with open(namespace_file_path, 'r') as namespace_file:
        namespace = namespace_file.read().strip()

    server_address = "https://registry-rest.apps.prod.rhoai.rh-aiservices-bu.com"

    registry = ModelRegistry(
        server_address=server_address,
        port=443,
        author=namespace,
        is_secure=False
    )

    # Model name should not include version in the registry
    registered_model_name = f"{user}-yolo-rps"
    version_name = version  

    metadata = {key: str(value) for key, value in metrics.metadata.items() if key not in ["display_name", "store_session_info"]}
    s3_path_updated_format = utils.s3_uri_from(model_artifact_s3_path,
                                               bucket=s3_bucket_name,
                                               endpoint=s3_endpoint_url,
                                               region=s3_region)

    # Check if version already exists
    try:
        existing_versions = registry.get_model_versions(registered_model_name)
        if version_name in existing_versions:
            print(f"Model version {version_name} already exists. Skipping registration.")
            return
    except exceptions.StoreError as e:
        print(f"Could not check existing versions: {e}")

    # Register Model only if version is new
    try:
        registry.register_model(
            registered_model_name,
            s3_path_updated_format,
            model_format_name="pt",
            model_format_version="1",
            version=version_name,
            description=f"{registered_model_name} is a Yolo-v11 model trained with Rock Paper Scissors dataset.",
            metadata=metadata
        )
        print("Model registered successfully.")
    except exceptions.StoreError as e:
        print(f"Failed to register model: {e}")

