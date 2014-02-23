"""Create player table

Revision ID: 521069b937a2
Revises: None
Create Date: 2014-02-22 21:05:13.250000

"""

# revision identifiers, used by Alembic.
revision = '521069b937a2'
down_revision = None

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import table, column


def upgrade():
    op.drop_table("player")
    op.create_table(
        'player',
        sa.Column('id', sa.Integer, primary_key=True),
        sa.Column('name', sa.Text),
        sa.Column('goals', sa.Integer, default=0),
        sa.Column('picture', sa.Text, default="images/unknown.jpg")
    )
    player = table('player',
                   column("id", sa.Integer),
                   column("name", sa.Text),
                   column("goals", sa.Integer),
                   column("picture", sa.Text)
                   )
    op.bulk_insert(player,
        [
            {'id': 1,
             'name': 'Tom Manley',
             'goals': 0,
             'picture': "images/tom.manley.jpg"},
            {'id': 2,
             'name': 'Peter Yamashiro',
             'goals': 0,
             'picture': "images/unknown.jpg"},
        ]
    )


def downgrade():
    pass
