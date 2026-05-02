"""account and upload enhancements

Revision ID: 0002_account_uploads
Revises: 0001_initial
Create Date: 2026-01-31 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = "0002_account_uploads"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("organizations", sa.Column("join_code", sa.String(), nullable=True))
    op.execute("UPDATE organizations SET join_code = substr(md5(random()::text), 0, 9) WHERE join_code IS NULL")
    op.alter_column("organizations", "join_code", nullable=False)
    op.create_unique_constraint("uq_organizations_join_code", "organizations", ["join_code"])

    op.add_column("users", sa.Column("is_email_verified", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column("users", sa.Column("email_verification_token", sa.String(), nullable=True))
    op.add_column("users", sa.Column("email_verification_sent_at", sa.DateTime(), nullable=True))
    op.add_column("users", sa.Column("password_reset_token", sa.String(), nullable=True))
    op.add_column("users", sa.Column("password_reset_sent_at", sa.DateTime(), nullable=True))

    op.add_column("documents", sa.Column("case_id", sa.String(), nullable=True))
    op.create_foreign_key("documents_case_id_fkey", "documents", "cases", ["case_id"], ["id"])


def downgrade() -> None:
    op.drop_constraint("documents_case_id_fkey", "documents", type_="foreignkey")
    op.drop_column("documents", "case_id")

    op.drop_column("users", "password_reset_sent_at")
    op.drop_column("users", "password_reset_token")
    op.drop_column("users", "email_verification_sent_at")
    op.drop_column("users", "email_verification_token")
    op.drop_column("users", "is_email_verified")

    op.drop_constraint("uq_organizations_join_code", "organizations", type_="unique")
    op.drop_column("organizations", "join_code")
