from abc import ABC, abstractmethod


class StorageAdapter(ABC):
    @abstractmethod
    def get_local_path(self, storage_path: str) -> str:
        raise NotImplementedError

    @abstractmethod
    def store(self, source_path: str, dest_path: str) -> str:
        raise NotImplementedError

    @abstractmethod
    def store_fileobj(self, fileobj, dest_path: str) -> str:
        raise NotImplementedError
