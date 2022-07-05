"""empty message

Revision ID: c6b183975be9
Revises: ccd80550c01f
Create Date: 2017-06-12 00:42:29.329727

"""

# revision identifiers, used by Alembic.
revision = 'c6b183975be9'
down_revision = 'ccd80550c01f'

from alembic import op
import sqlalchemy as sa
import sqlalchemy_utils


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('ticket_holders', sa.Column('pdf_url', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('ticket_holders', 'pdf_url')
    # ### end Alembic commands ###
