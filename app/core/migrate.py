"""
Add new columns to existing tables when the schema has been updated.
Runs after create_all on startup. Safe to run multiple times.
PostgreSQL only (uses IF NOT EXISTS).
"""

from sqlalchemy import text
from app.core.database import engine


def migrate_findings_review_columns():
    """Add model_agreement, validated_by, and human-in-the-loop columns to findings table if missing."""
    if "postgresql" not in str(engine.url):
        return  # Skip for SQLite etc.
    stmts = [
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS model_agreement VARCHAR(50)",
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS validated_by VARCHAR(255)",
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS review_status VARCHAR(20)",
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS reviewed_by INTEGER",
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMP WITH TIME ZONE",
        "ALTER TABLE findings ADD COLUMN IF NOT EXISTS review_note TEXT",
    ]
    with engine.connect() as conn:
        for stmt in stmts:
            try:
                conn.execute(text(stmt))
                conn.commit()
                print(f"[Migration] OK: {stmt[:60]}...", flush=True)
            except Exception as e:
                conn.rollback()
                print(f"[Migration] Failed: {stmt[:60]}... Error: {e}", flush=True)
