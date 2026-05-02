import os
import shutil

from app.core.config import settings
from app.storage.base import StorageAdapter


class LocalStorageAdapter(StorageAdapter):
    def get_local_path(self, storage_path: str) -> str:
        return os.path.join(settings.UPLOAD_DIR, storage_path)

    def store(self, source_path: str, dest_path: str) -> str:
        full_path = self.get_local_path(dest_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        shutil.copyfile(source_path, full_path)
        return full_path

    def store_fileobj(self, fileobj, dest_path: str) -> str:
        full_path = self.get_local_path(dest_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as target:
            shutil.copyfileobj(fileobj, target)
        return full_path
