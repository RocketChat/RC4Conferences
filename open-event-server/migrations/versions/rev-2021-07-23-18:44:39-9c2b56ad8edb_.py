"""empty message

Revision ID: 9c2b56ad8edb
Revises: 304e8820c95a
Create Date: 2021-07-23 18:44:39.628974

"""

from alembic import op
import sqlalchemy as sa
import sqlalchemy_utils


# revision identifiers, used by Alembic.
revision = '9c2b56ad8edb'
down_revision = '304e8820c95a'


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('groups', 'contact_link')
    op.drop_column('groups', 'contact_email')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('groups', sa.Column('contact_email', sa.VARCHAR(), autoincrement=False, nullable=True))
    op.add_column('groups', sa.Column('contact_link', sa.VARCHAR(), autoincrement=False, nullable=True))
    # ### end Alembic commands ###
