"""
Add new columns to existing tables when the schema has been updated.
Runs after create_all on startup. Safe to run multiple times.
PostgreSQL only (uses IF NOT EXISTS).
"""

from sqlalchemy import text
from app.core.database import engine


def migrate_findings_review_columns():
    """Add human-in-the-loop review columns to findings table if missing."""
    if "postgresql" not in str(engine.url):
        return  # Skip for SQLite etc.
    stmts = [
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS review_status VARCHAR(20)",
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS reviewed_by INTEGER REFERENCES users(id)",
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE",
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS review_note TEXT",
    ]
    with engine.connect() as conn:
        for stmt in stmts:
            try:
                conn.execute(text(stmt))
                conn.commit()
            except Exception as e:
                conn.rollback()
                if "does not exist" not in str(e).lower():
                    print(f"[Migration] {e}", flush=True)
