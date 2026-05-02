from app.core.config import settings
from app.storage.base import StorageAdapter
from app.storage.local import LocalStorageAdapter
from app.storage.s3 import S3StorageAdapter


def get_storage_adapter() -> StorageAdapter:
    if settings.STORAGE_TYPE == "s3":
        return S3StorageAdapter()
    return LocalStorageAdapter()


__all__ = ["StorageAdapter", "LocalStorageAdapter", "S3StorageAdapter", "get_storage_adapter"]
