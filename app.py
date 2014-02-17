import os
from flask import Flask
from flask.ext.restless import APIManager
from flask.ext.sqlalchemy import SQLAlchemy

app = Flask(__name__, static_url_path="")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///stats.db')
db = SQLAlchemy(app)


class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True)
    goals = db.Column(db.Integer, default=0)

api_manager = APIManager(app, flask_sqlalchemy_db=db)
api_manager.create_api(Player, methods=['GET', 'POST'])


@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
