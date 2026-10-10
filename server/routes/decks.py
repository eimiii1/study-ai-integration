from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Deck

decks_bp = Blueprint('decks', __name__, url_prefix='/api/decks')

@decks_bp.route('', methods=['POST'])
@jwt_required() 
def create_deck():
    user_id = get_jwt_identity()
    data = request.get_json()

    title = data.get('title')
    description = data.get('description')
    parent_deck_id = data.get('parent_deck_id')

    if not title:
        return jsonify({'error' : 'Title is required.'}), 400

    if parent_deck_id:
        parent_deck = Deck.query.filter_by(id=parent_deck_id, user_id=user_id).first()
        if not parent_deck:
            return jsonify({'error' : 'Parent deck not found.'}), 404

        if parent_deck.parent_deck_id is not None:
            return jsonify({'error' : 'Cannot create a subdeck for a subdeck.'}), 400

    new_deck = Deck(
        title=title, 
        description=description, 
        user_id=user_id,
        parent_deck_id=parent_deck_id
        )

    db.session.add(new_deck)
    db.session.commit()

    return jsonify({
        'id' : new_deck.id,
        'title' : new_deck.title,
        'description' : new_deck.description,
        'parent_deck_id' : new_deck.parent_deck_id
    }), 201

@decks_bp.route('', methods=['GET'])
@jwt_required() 
def get_decks():
    user_id = get_jwt_identity()
    decks = Deck.query.filter_by(user_id=user_id).all()

    return jsonify([
        {
            'id' : deck.id,
            'title' : deck.title,
            'description' : deck.description,
            'parent_deck_id' : deck.parent_deck_id,
            'subdeck_count' : len(deck.subdecks),
            'card_count' : len(deck.flashcards)
        }
        for deck in decks
    ]), 200

@decks_bp.route('/<int:deck_id>', methods=['PUT'])
@jwt_required()
def update_deck(deck_id):
    user_id = get_jwt_identity()

    deck = Deck.query.filter_by(id=deck_id, user_id=user_id).first()
    if not deck:
        return jsonify({'error' : 'Deck not found.'}), 404

    if deck.parent_deck_id is not None:
        return jsonify({'error' : 'Cannot update a subdeck.'}), 400

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title:
        return jsonify({'error' : 'Title is required.'}), 400

    deck.title = title 
    deck.description = description 
    db.session.commit()

    return jsonify({
        'id' : deck.id,
        'title' : deck.title,
        'description' : deck.description
    }), 200

@decks_bp.route('/<int:deck_id>', methods=['DELETE'])
@jwt_required()
def delete_deck(deck_id):
    user_id = get_jwt_identity()

    deck = Deck.query.filter_by(id=deck_id, user_id=user_id).first()
    if not deck:
        return jsonify({'error' : 'Deck not found.'}), 404

    if deck.parent_deck_id is not None:
        return jsonify({'error' : 'Cannot delete a subdeck.'}), 400

    db.session.delete(deck)
    db.session.commit()

    return jsonify({'message' : 'Deck deleted successfully.'}), 200