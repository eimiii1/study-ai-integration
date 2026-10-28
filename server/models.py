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
    # What shape the frontend draws for this item (chair, lamp, plant, ...).
    kind = db.Column(db.String(30), nullable=False, default='chair')
    # Controls both drop odds and the badge color: common / rare / epic.
    rarity = db.Column(db.String(10), nullable=False, default='common')
    # 'floor' items sit on a floor tile; 'wall' items hang on one of the two
    # back walls (frames, clocks, corkboards, ...). Decides where in the
    # room grid this item is allowed to snap to.
    placement_zone = db.Column(db.String(10), nullable=False, default='floor')

# user furniture model - a collection of items that a user owns.
class UserFurniture(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    furniture_id = db.Column(db.Integer, db.ForeignKey('furniture.id'), nullable=False)
    # Earning a duplicate increases this instead of creating a new row.
    quantity = db.Column(db.Integer, nullable=False, default=1)

    owner = db.relationship('User', backref='furniture_collection')
    furniture = db.relationship('Furniture')

    __table_args__ = (
        db.UniqueConstraint('user_id', 'furniture_id', name='uq_user_furniture'),
    )

# room item model - one placed instance of an owned furniture item in a
# user's room. Placing one moves it out of the "available" pool (quantity
# minus how many of that furniture are currently placed); removing it from
# the room returns it to that pool.
#
# The room is a tile grid (see utils/room_grid.py for the constants and the
# math). x/y are GRID coordinates, not pixels:
#   - floor items: wall_side is NULL, x/y are the tile column/row (0..GRID_SIZE-1).
#   - wall items: wall_side is 'left' or 'right', x is the slot index along
#     that wall (0..GRID_SIZE-1), y is unused (0).
# z_index is recomputed server-side on every place/move from the tile
# position so items that are visually "in front" always draw on top.
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

