import random

from models import db, Furniture, UserFurniture

# Higher weight = more likely to drop. Doesn't need to sum to 100 — random.choices
# just normalizes whatever's here, which also means adding a new rarity tier
# later is a one-line change.
RARITY_WEIGHTS = {'common': 60, 'rare': 30, 'epic': 10}

# Chance a correct answer drops anything at all. Keeps rewards exciting
# instead of a guaranteed "ding" on every question.
AWARD_CHANCE = 0.5


def maybe_award_furniture(user_id):
    """Rolls for a furniture drop on a correct answer. Returns the awarded
    Furniture row, or None if the roll missed or the catalog is empty."""
    if random.random() > AWARD_CHANCE:
        return None

    catalog = Furniture.query.all()
    if not catalog:
        return None

    weights = [RARITY_WEIGHTS.get(item.rarity, 1) for item in catalog]
    chosen = random.choices(catalog, weights=weights, k=1)[0]

    owned = UserFurniture.query.filter_by(user_id=user_id, furniture_id=chosen.id).first()
    if owned:
        owned.quantity += 1
    else:
        owned = UserFurniture(user_id=user_id, furniture_id=chosen.id, quantity=1)
        db.session.add(owned)

    db.session.commit()
    return chosen
