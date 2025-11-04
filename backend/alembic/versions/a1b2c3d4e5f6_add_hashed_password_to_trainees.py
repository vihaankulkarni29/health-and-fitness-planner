"""add hashed_password to trainees

Revision ID: a1b2c3d4e5f6
Revises: 8d6182753d7a
Create Date: 2025-11-04

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'a1b2c3d4e5f6'
down_revision = '8d6182753d7a'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        'trainees',
        sa.Column('hashed_password', sa.String(length=255), nullable=False, server_default='')
    )
    # Optional: remove server_default after population in production migrations


def downgrade() -> None:
    op.drop_column('trainees', 'hashed_password')
