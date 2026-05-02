import os
import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(root_dir / "apps" / "api"))

os.environ.setdefault("DATABASE_URL", "sqlite:///./test.db")
os.environ.setdefault("UPLOAD_DIR", str(root_dir / "uploads_test"))
os.environ.setdefault("AI_ALLOW_STUB", "true")

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.core.database import Base, SessionLocal, engine, get_db  # noqa: E402
from app.main import app  # noqa: E402


def override_get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def reset_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield


@pytest.fixture()
def db_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture()
def client():
    return TestClient(app)
