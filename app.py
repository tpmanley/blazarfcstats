import os
from flask import Flask, request, make_response, render_template, redirect
from flask.ext.restless import APIManager
from flask.ext.sqlalchemy import SQLAlchemy
from authomatic.providers import oauth2
from authomatic.adapters import WerkzeugAdapter
from authomatic import Authomatic

CONFIG = {
    'fb': {
        'class_': oauth2.Facebook,
        # Facebook is an AuthorizationProvider too.
        'consumer_key': os.environ.get('FACEBOOK_KEY'),
        'consumer_secret': os.environ.get('FACEBOOK_SECRET'),
        # But it is also an OAuth 2.0 provider and it needs scope.
        'scope': ['user_about_me', 'email', 'publish_stream'],
    },
}

app = Flask(__name__, static_url_path="")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///stats.db')
db = SQLAlchemy(app)

authomatic = Authomatic(CONFIG, 'your secret string', report_errors=False)


class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True)
    goals = db.Column(db.Integer, default=0)
    picture = db.Column(db.Text)

api_manager = APIManager(app, flask_sqlalchemy_db=db)
api_manager.create_api(Player, methods=['GET', 'PUT'])


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/login/<provider_name>/', methods=['GET', 'POST'])
def login(provider_name):
    """
    Login handler, must accept both GET and POST to be able to use OpenID.
    """

    # We need response object for the WerkzeugAdapter.
    response = make_response()

    # Log the user in, pass it the adapter and the provider name.
    result = authomatic.login(WerkzeugAdapter(request, response), provider_name)

    # If there is no LoginResult object, the login procedure is still pending.
    if result:
        if result.user:
            # We need to update the user to get more info.
            result.user.update()
            player = Player.query.filter_by(name=result.user.name).first()
            if player:
                fb_pic_url = "https://graph.facebook.com/%s/picture?height=200&type=normal&width=200" % result.user.id
                player.picture = fb_pic_url
                db.session.commit()

        # The rest happens inside the template.
        return redirect('/')

    # Don't forget to return the response.
    return response


if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
