import boto3

from app.core.config import settings
from app.storage.base import StorageAdapter


class S3StorageAdapter(StorageAdapter):
    def get_local_path(self, storage_path: str) -> str:
        raise NotImplementedError("S3 adapter does not provide local paths")

    def store(self, source_path: str, dest_path: str) -> str:
        client = boto3.client("s3", region_name=settings.AWS_REGION)
        key = f"{settings.S3_PREFIX}/{dest_path}".lstrip("/")
        client.upload_file(source_path, settings.S3_BUCKET_NAME, key)
        return key

    def store_fileobj(self, fileobj, dest_path: str) -> str:
        client = boto3.client("s3", region_name=settings.AWS_REGION)
        key = f"{settings.S3_PREFIX}/{dest_path}".lstrip("/")
        client.upload_fileobj(fileobj, settings.S3_BUCKET_NAME, key)
        return key
