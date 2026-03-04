#!/usr/bin/env python3
"""Run the findings table migration manually. Use if startup migration fails."""
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.migrate import migrate_findings_review_columns

if __name__ == "__main__":
    print("Running findings migration...")
    migrate_findings_review_columns()
    print("Done.")
