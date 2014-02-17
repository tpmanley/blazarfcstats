import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app import db, Player, app


def update_db():
    with app.app_context():
        session = db.session()
        db.metadata.create_all(db.engine)
        session.merge(
            Player(
                id=1,
                name="Tom Manley",
                goals=0,
            )
        )
        session.merge(
            Player(
                id=2,
                name="Peter Yamashiro",
                goals=0,
            )
        )
        session.commit()


if __name__ == "__main__":
    db.create_all()
    update_db()
