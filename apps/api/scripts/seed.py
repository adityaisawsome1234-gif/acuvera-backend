import sys
from pathlib import Path

root_dir = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(root_dir / "apps" / "api"))

from app.core.database import Base, engine  # noqa: E402
from app.services import seed_default_org_admin  # noqa: E402


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_default_org_admin()
    print("Seeded default organization and admin user.")
