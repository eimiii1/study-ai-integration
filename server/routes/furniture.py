from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy import func

from models import db, Furniture, UserFurniture, RoomItem
from utils.room_grid import (
    compute_z_index,
    find_open_slot,
    validate_bounds,
    validate_zone,
)

furniture_bp = Blueprint('furniture', __name__, url_prefix='/api')


def _serialize_furniture(f):
    return {
        'id': f.id,
        'name': f.name,
        'kind': f.kind,
        'rarity': f.rarity,
        'image_url': f.image_url,
        'placement_zone': f.placement_zone,
    }


def _placed_counts(user_id):
    """{furniture_id: how many of it are currently placed in the user's room}."""
    rows = (
        db.session.query(RoomItem.furniture_id, func.count(RoomItem.id))
        .filter(RoomItem.user_id == user_id)
        .group_by(RoomItem.furniture_id)
        .all()
    )
    return dict(rows)


# The full catalog of furniture that exists in the game, owned or not — used
# to show "locked" items on a collection screen.
@furniture_bp.route('/furniture', methods=['GET'])
@jwt_required()
def list_catalog():
    items = Furniture.query.order_by(Furniture.rarity, Furniture.name).all()
    return jsonify([_serialize_furniture(f) for f in items]), 200


# What this user actually owns, with how many of each are free to place
# right now (quantity minus however many are already sitting in the room).
@furniture_bp.route('/furniture/inventory', methods=['GET'])
@jwt_required()
def inventory():
    user_id = get_jwt_identity()
    owned = UserFurniture.query.filter_by(user_id=user_id).all()
    placed = _placed_counts(user_id)

    return jsonify([
        {
            **_serialize_furniture(uf.furniture),
            'quantity': uf.quantity,
            'placed': placed.get(uf.furniture_id, 0),
            'available': uf.quantity - placed.get(uf.furniture_id, 0),
        }
        for uf in owned
    ]), 200


def _serialize_room_item(item):
    # _serialize_furniture also returns an 'id' (the catalog item's id), so it
    # has to come first — then room_item_id is set after, or the spread would
    # clobber this placement's own id with the furniture's.
    return {
        **_serialize_furniture(item.furniture),
        'room_item_id': item.id,
        'furniture_id': item.furniture_id,
        'x': item.x,
        'y': item.y,
        'wall_side': item.wall_side,
        'z_index': item.z_index,
        'flipped': item.flipped,
        'scale': item.scale,
    }


def _occupied(user_id, x, y, wall_side, exclude_item_id=None):
    """Is some OTHER room item of this user already on this exact tile/slot?"""
    q = RoomItem.query.filter_by(user_id=user_id, wall_side=wall_side)
    if wall_side is not None:
        q = q.filter_by(x=x)
    else:
        q = q.filter_by(x=x, y=y)
    if exclude_item_id is not None:
        q = q.filter(RoomItem.id != exclude_item_id)
    return q.first() is not None


@furniture_bp.route('/room', methods=['GET'])
@jwt_required()
def get_room():
    user_id = get_jwt_identity()
    items = RoomItem.query.filter_by(user_id=user_id).order_by(RoomItem.z_index).all()
    return jsonify([_serialize_room_item(i) for i in items]), 200


@furniture_bp.route('/room', methods=['POST'])
@jwt_required()
def place_item():
    user_id = get_jwt_identity()
    data = request.get_json() or {}

    furniture_id = data.get('furniture_id')
    owned = UserFurniture.query.filter_by(user_id=user_id, furniture_id=furniture_id).first()
    if not owned:
        return jsonify({'error': "You don't own this item."}), 404

    placed_count = RoomItem.query.filter_by(user_id=user_id, furniture_id=furniture_id).count()
    if placed_count >= owned.quantity:
        return jsonify({'error': 'No more of this item available to place.'}), 400

    furniture = owned.furniture
    wall_side = data.get('wall_side')
    x = data.get('x')
    y = data.get('y', 0)

    # No spot given (e.g. a plain inventory click) -- find the first free
    # tile/slot that matches this item's zone instead of rejecting it.
    if x is None:
        existing = RoomItem.query.filter_by(user_id=user_id).all()
        slot = find_open_slot(existing, furniture.placement_zone)
        if slot is None:
            return jsonify({'error': 'Your room is full.'}), 400
        x, y, wall_side = slot
    else:
        zone_error = validate_zone(furniture, wall_side)
        if zone_error:
            return jsonify({'error': zone_error}), 400
        bounds_error = validate_bounds(x, y, wall_side)
        if bounds_error:
            return jsonify({'error': bounds_error}), 400
        if _occupied(user_id, x, y, wall_side):
            return jsonify({'error': 'Something is already there.'}), 400

    item = RoomItem(
        user_id=user_id,
        furniture_id=furniture_id,
        x=x,
        y=y,
        wall_side=wall_side,
        z_index=compute_z_index(x, y, wall_side),
    )
    db.session.add(item)
    db.session.commit()

    return jsonify(_serialize_room_item(item)), 201


@furniture_bp.route('/room/<int:item_id>', methods=['PUT'])
@jwt_required()
def move_item(item_id):
    user_id = get_jwt_identity()
    item = RoomItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({'error': 'Placed item not found.'}), 404

    data = request.get_json() or {}

    # Moving to a new tile/wall slot.
    if 'x' in data:
        x = data['x']
        y = data.get('y', 0)
        wall_side = data.get('wall_side', item.wall_side)

        zone_error = validate_zone(item.furniture, wall_side)
        if zone_error:
            return jsonify({'error': zone_error}), 400
        bounds_error = validate_bounds(x, y, wall_side)
        if bounds_error:
            return jsonify({'error': bounds_error}), 400
        if _occupied(user_id, x, y, wall_side, exclude_item_id=item.id):
            return jsonify({'error': 'Something is already there.'}), 400

        item.x = x
        item.y = y
        item.wall_side = wall_side
        item.z_index = compute_z_index(x, y, wall_side)

    if 'flipped' in data:
        item.flipped = bool(data['flipped'])

    if 'scale' in data:
        item.scale = max(60, min(140, int(data['scale'])))

    db.session.commit()
    return jsonify(_serialize_room_item(item)), 200


@furniture_bp.route('/room/<int:item_id>', methods=['DELETE'])
@jwt_required()
def remove_item(item_id):
    user_id = get_jwt_identity()
    item = RoomItem.query.filter_by(id=item_id, user_id=user_id).first()
    if not item:
        return jsonify({'error': 'Placed item not found.'}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({'message': 'Item returned to inventory.'}), 200
