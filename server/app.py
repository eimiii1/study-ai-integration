from flask import Flask
from config import Config
from models import db
from routes.auth import auth_bp
from routes.decks import decks_bp
from routes.flashcards import flashcards_bp
from routes.notes import notes_bp
from routes.quizzes import quizzes_bp
from flask_jwt_extended import JWTManager
from flask_cors import CORS

app = Flask(__name__)
app.config.from_object(Config)

CORS(app, origins="*")

db.init_app(app)
app.register_blueprint(auth_bp)
app.register_blueprint(decks_bp)
app.register_blueprint(flashcards_bp)
app.register_blueprint(notes_bp)
app.register_blueprint(quizzes_bp)

jwt = JWTManager(app)

@app.route('/')
def home():
    return "Hello nig"

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5001, debug=True)