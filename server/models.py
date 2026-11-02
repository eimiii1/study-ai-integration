from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy() 

# user model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    # to set password
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # to check password
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# deck model
class Deck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    parent_deck_id = db.Column(db.Integer, db.ForeignKey('deck.id'), nullable=True)

    owner = db.relationship('User', backref='decks')
    subdecks = db.relationship(
        'Deck', 
        backref=db.backref('parent_deck', remote_side=[id]),
        cascade='all, delete-orphan'
        )


# flashcard model 
class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    front = db.Column(db.Text, nullable=False)
    back = db.Column(db.Text, nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey('deck.id'), nullable=False)

    deck = db.relationship('Deck', backref=db.backref('flashcards', cascade='all, delete-orphan'))


# note model
class Note(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    content = db.Column(db.Text, nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey('deck.id'), nullable=False)

    deck = db.relationship('Deck', backref=db.backref('notes', cascade='all, delete-orphan'))

# furniture model - a full collection of items that users can possibly own.
class Furniture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    kind = db.Column(db.String(30), nullable=False, default='chair')
    rarity = db.Column(db.String(10), nullable=False, default='common')
    placement_zone = db.Column(db.String(10), nullable=False, default='floor')

# user furniture model - a collection of items that a user owns.
class UserFurniture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    furniture_id = db.Column(db.Integer, db.ForeignKey('furniture.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)

    owner = db.relationship('User', backref='furniture_collection')
    furniture = db.relationship('Furniture')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'furniture_id', name='uq_user_furniture'),
    )

# room item model
class RoomItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    furniture_id = db.Column(db.Integer, db.ForeignKey('furniture.id'), nullable=False)
    x = db.Column(db.Integer, nullable=False, default=0)
    y = db.Column(db.Integer, nullable=False, default=0)
    wall_side = db.Column(db.String(5), nullable=True)
    z_index = db.Column(db.Integer, nullable=False, default=0)
    flipped = db.Column(db.Boolean, nullable=False, default=False)
    # Percent scale of the item's normal size, e.g. 100 = normal, 70 = smaller.
    scale = db.Column(db.Integer, nullable=False, default=100)

    owner = db.relationship('User', backref=db.backref('room_items', cascade='all, delete-orphan'))
    furniture = db.relationship('Furniture')

# quiz model
class Quiz(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    deck_id = db.Column(db.Integer, db.ForeignKey('deck.id'), nullable=False)

    deck = db.relationship('Deck', backref=db.backref('quizzes', cascade='all, delete-orphan'))

# quiz question model
class Question(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question_type = db.Column(db.String(20), nullable=False)
    question_text = db.Column(db.Text, nullable=False)
    correct_answer = db.Column(db.JSON, nullable=False)
    choices = db.Column(db.JSON, nullable=True)
    difficulty = db.Column(db.String(10), nullable=True)
    explanation = db.Column(db.Text, nullable=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey('quiz.id'), nullable=False)

    quiz = db.relationship('Quiz', backref=db.backref('questions', cascade='all, delete-orphan'))

