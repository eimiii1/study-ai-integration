"""Shared constants + validation for the room's isometric tile grid.

The room is a GRID_SIZE x GRID_SIZE floor, plus two "back" walls running
along its two far edges (left and right). Furniture snaps onto either the
floor grid or a wall slot, never anywhere in between -- that's what makes
placement "structured" instead of free-form.

Keep GRID_SIZE in sync with client/src/lib/roomGrid.ts -- that file mirrors
this one so the frontend can draw/snap to the same grid without an extra
round trip per pointer move.
"""

GRID_SIZE = 6  # floor is GRID_SIZE x GRID_SIZE tiles; each wall has GRID_SIZE slots


def validate_zone(furniture, wall_side):
    """Does this furniture's zone (floor/wall) match where it's being put?"""
    zone = furniture.placement_zone
    if zone == 'wall' and wall_side not in ('left', 'right'):
        return "This item hangs on a wall -- pick a wall slot to place it."
    if zone == 'floor' and wall_side is not None:
        return "This item sits on the floor -- it can't go on a wall."
    return None


def validate_bounds(x, y, wall_side):
    """Is (x, y) inside the grid for this zone?"""
    if wall_side is not None:
        if not (0 <= x < GRID_SIZE):
            return "That wall slot doesn't exist."
        return None
    if not (0 <= x < GRID_SIZE and 0 <= y < GRID_SIZE):
        return "That's outside the room."
    return None


def compute_z_index(x, y, wall_side):
    """Deterministic draw order from tile position.

    Walls always sit behind every floor item. Within the floor, tiles
    closer to the viewer (larger x + y) draw after -- i.e. on top of --
    tiles further back, which is what makes the isometric overlap look
    right.
    """
    if wall_side is not None:
        return -1000 + x
    return (x + y) * 10


def find_open_slot(existing_items, zone):
    """First unoccupied (x, y, wall_side) for this zone, or None if full.

    existing_items is a list of RoomItem rows already in the room (any
    zone) -- used so a client that doesn't pick a spot itself (e.g. a
    plain inventory click) still lands somewhere free.
    """
    if zone == 'wall':
        taken_left = {i.x for i in existing_items if i.wall_side == 'left'}
        taken_right = {i.x for i in existing_items if i.wall_side == 'right'}
        for side, taken in (('left', taken_left), ('right', taken_right)):
            for slot in range(GRID_SIZE):
                if slot not in taken:
                    return slot, 0, side
        return None

    taken = {(i.x, i.y) for i in existing_items if i.wall_side is None}
    for gy in range(GRID_SIZE):
        for gx in range(GRID_SIZE):
            if (gx, gy) not in taken:
                return gx, gy, None
    return None
