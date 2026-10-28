"""Seeds the Furniture catalog from the art assets in client/public/game/furniture.

Run once (or whenever the catalog changes):
    python seed_furniture.py
Safe to re-run — it skips names that already exist instead of duplicating them.
"""
from app import app
from models import db, Furniture

# Kinds that hang on a wall rather than sit on the floor. Everything else in
# the catalog defaults to 'floor'.
WALL_KINDS = {'frame', 'clock', 'corkboard', 'wire_board'}

CATALOG = [
    {'name': 'Bed Green', 'kind': 'bed', 'rarity': 'rare', 'image_url': '/game/furniture/bed_green.png'},
    {'name': 'Tv Unit Dark Wood', 'kind': 'tv_unit', 'rarity': 'rare', 'image_url': '/game/furniture/tv_unit_dark_wood.png'},
    {'name': 'Bed Cream', 'kind': 'bed', 'rarity': 'rare', 'image_url': '/game/furniture/bed_cream.png'},
    {'name': 'Bed Navy', 'kind': 'bed', 'rarity': 'rare', 'image_url': '/game/furniture/bed_navy.png'},
    {'name': 'Bed Pink', 'kind': 'bed', 'rarity': 'rare', 'image_url': '/game/furniture/bed_pink.png'},
    {'name': 'Sofa Grey', 'kind': 'sofa', 'rarity': 'rare', 'image_url': '/game/furniture/sofa_grey.png'},
    {'name': 'Sofa Cream', 'kind': 'sofa', 'rarity': 'rare', 'image_url': '/game/furniture/sofa_cream.png'},
    {'name': 'Sofa Green', 'kind': 'sofa', 'rarity': 'rare', 'image_url': '/game/furniture/sofa_green.png'},
    {'name': 'Tv Unit Light Wood', 'kind': 'tv_unit', 'rarity': 'rare', 'image_url': '/game/furniture/tv_unit_light_wood.png'},
    {'name': 'Sofa Terracotta', 'kind': 'sofa', 'rarity': 'rare', 'image_url': '/game/furniture/sofa_terracotta.png'},
    {'name': 'Tv Unit White Vine', 'kind': 'tv_unit', 'rarity': 'rare', 'image_url': '/game/furniture/tv_unit_white_vine.png'},
    {'name': 'Tv Unit Wood Shelf', 'kind': 'tv_unit', 'rarity': 'rare', 'image_url': '/game/furniture/tv_unit_wood_shelf.png'},
    {'name': 'Desk Wood Laptop', 'kind': 'desk', 'rarity': 'common', 'image_url': '/game/furniture/desk_wood_laptop.png'},
    {'name': 'Desk White Laptop', 'kind': 'desk', 'rarity': 'common', 'image_url': '/game/furniture/desk_white_laptop.png'},
    {'name': 'Desk Corner Dark', 'kind': 'desk', 'rarity': 'common', 'image_url': '/game/furniture/desk_corner_dark.png'},
    {'name': 'Desk Small Books', 'kind': 'desk', 'rarity': 'common', 'image_url': '/game/furniture/desk_small_books.png'},
    {'name': 'Chair Office Cream', 'kind': 'chair', 'rarity': 'common', 'image_url': '/game/furniture/chair_office_cream.png'},
    {'name': 'Chair Gaming Pink', 'kind': 'chair', 'rarity': 'common', 'image_url': '/game/furniture/chair_gaming_pink.png'},
    {'name': 'Armchair Wood Cream', 'kind': 'armchair', 'rarity': 'common', 'image_url': '/game/furniture/armchair_wood_cream.png'},
    {'name': 'Chair Swivel Green', 'kind': 'chair', 'rarity': 'common', 'image_url': '/game/furniture/chair_swivel_green.png'},
    {'name': 'Chair Office Black', 'kind': 'chair', 'rarity': 'common', 'image_url': '/game/furniture/chair_office_black.png'},
    {'name': 'Armchair Green', 'kind': 'armchair', 'rarity': 'common', 'image_url': '/game/furniture/armchair_green.png'},
    {'name': 'Bookshelf Wood', 'kind': 'bookshelf', 'rarity': 'common', 'image_url': '/game/furniture/bookshelf_wood.png'},
    {'name': 'Bookshelf White', 'kind': 'bookshelf', 'rarity': 'common', 'image_url': '/game/furniture/bookshelf_white.png'},
    {'name': 'Bookshelf Dark', 'kind': 'bookshelf', 'rarity': 'common', 'image_url': '/game/furniture/bookshelf_dark.png'},
    {'name': 'Bookshelf Ladder', 'kind': 'bookshelf', 'rarity': 'common', 'image_url': '/game/furniture/bookshelf_ladder.png'},
    {'name': 'Bookshelf Arched', 'kind': 'bookshelf', 'rarity': 'common', 'image_url': '/game/furniture/bookshelf_arched.png'},
    {'name': 'Bookshelf Cubby', 'kind': 'bookshelf', 'rarity': 'common', 'image_url': '/game/furniture/bookshelf_cubby.png'},
    {'name': 'Table Round Wood', 'kind': 'table', 'rarity': 'common', 'image_url': '/game/furniture/table_round_wood.png'},
    {'name': 'Table Coffee Metal', 'kind': 'table', 'rarity': 'common', 'image_url': '/game/furniture/table_coffee_metal.png'},
    {'name': 'Table Side White', 'kind': 'table', 'rarity': 'common', 'image_url': '/game/furniture/table_side_white.png'},
    {'name': 'Table Nesting', 'kind': 'table', 'rarity': 'common', 'image_url': '/game/furniture/table_nesting.png'},
    {'name': 'Table Drum Wood', 'kind': 'table', 'rarity': 'common', 'image_url': '/game/furniture/table_drum_wood.png'},
    {'name': 'Table Pedestal Green', 'kind': 'table', 'rarity': 'common', 'image_url': '/game/furniture/table_pedestal_green.png'},
    {'name': 'Rug Beige Rect', 'kind': 'rug', 'rarity': 'common', 'image_url': '/game/furniture/rug_beige_rect.png'},
    {'name': 'Rug Green Rect', 'kind': 'rug', 'rarity': 'common', 'image_url': '/game/furniture/rug_green_rect.png'},
    {'name': 'Rug Lined', 'kind': 'rug', 'rarity': 'common', 'image_url': '/game/furniture/rug_lined.png'},
    {'name': 'Rug Clover Green', 'kind': 'rug', 'rarity': 'common', 'image_url': '/game/furniture/rug_clover_green.png'},
    {'name': 'Dresser Wood', 'kind': 'dresser', 'rarity': 'rare', 'image_url': '/game/furniture/dresser_wood.png'},
    {'name': 'Dresser White', 'kind': 'dresser', 'rarity': 'rare', 'image_url': '/game/furniture/dresser_white.png'},
    {'name': 'Cabinet Dark', 'kind': 'cabinet', 'rarity': 'rare', 'image_url': '/game/furniture/cabinet_dark.png'},
    {'name': 'Wardrobe Wood', 'kind': 'wardrobe', 'rarity': 'rare', 'image_url': '/game/furniture/wardrobe_wood.png'},
    {'name': 'Wardrobe Green', 'kind': 'wardrobe', 'rarity': 'rare', 'image_url': '/game/furniture/wardrobe_green.png'},
    {'name': 'Shelf Storage White', 'kind': 'shelf', 'rarity': 'common', 'image_url': '/game/furniture/shelf_storage_white.png'},
    {'name': 'Rug Round Beige', 'kind': 'rug', 'rarity': 'common', 'image_url': '/game/furniture/rug_round_beige.png'},
    {'name': 'Rug Round Green', 'kind': 'rug', 'rarity': 'common', 'image_url': '/game/furniture/rug_round_green.png'},
    {'name': 'Rug Flower', 'kind': 'rug', 'rarity': 'common', 'image_url': '/game/furniture/rug_flower.png'},
    {'name': 'Rug Checker', 'kind': 'rug', 'rarity': 'common', 'image_url': '/game/furniture/rug_checker.png'},
    {'name': 'Lamp Desk Black', 'kind': 'lamp', 'rarity': 'common', 'image_url': '/game/furniture/lamp_desk_black.png'},
    {'name': 'Lamp Tripod', 'kind': 'lamp', 'rarity': 'common', 'image_url': '/game/furniture/lamp_tripod.png'},
    {'name': 'Lamp Floor Arc', 'kind': 'lamp', 'rarity': 'common', 'image_url': '/game/furniture/lamp_floor_arc.png'},
    {'name': 'Lamp Pillar', 'kind': 'lamp', 'rarity': 'common', 'image_url': '/game/furniture/lamp_pillar.png'},
    {'name': 'Clock Black', 'kind': 'clock', 'rarity': 'common', 'image_url': '/game/furniture/clock_black.png'},
    {'name': 'Clock Green', 'kind': 'clock', 'rarity': 'common', 'image_url': '/game/furniture/clock_green.png'},
    {'name': 'Clock Wood', 'kind': 'clock', 'rarity': 'common', 'image_url': '/game/furniture/clock_wood.png'},
    {'name': 'Plant Pot Square', 'kind': 'plant', 'rarity': 'common', 'image_url': '/game/furniture/plant_pot_square.png'},
    {'name': 'Plant Hanging A', 'kind': 'plant', 'rarity': 'common', 'image_url': '/game/furniture/plant_hanging_a.png'},
    {'name': 'Plant Monstera', 'kind': 'plant', 'rarity': 'common', 'image_url': '/game/furniture/plant_monstera.png'},
    {'name': 'Plant Snake', 'kind': 'plant', 'rarity': 'common', 'image_url': '/game/furniture/plant_snake.png'},
    {'name': 'Plant Bush', 'kind': 'plant', 'rarity': 'common', 'image_url': '/game/furniture/plant_bush.png'},
    {'name': 'Plant Small', 'kind': 'plant', 'rarity': 'common', 'image_url': '/game/furniture/plant_small.png'},
    {'name': 'Plant Hanging B', 'kind': 'plant', 'rarity': 'common', 'image_url': '/game/furniture/plant_hanging_b.png'},
    {'name': 'Plant On Books', 'kind': 'plant', 'rarity': 'common', 'image_url': '/game/furniture/plant_on_books.png'},
    {'name': 'Lamp Desk Wood', 'kind': 'lamp', 'rarity': 'common', 'image_url': '/game/furniture/lamp_desk_wood.png'},
    {'name': 'Lamp Mushroom', 'kind': 'lamp', 'rarity': 'common', 'image_url': '/game/furniture/lamp_mushroom.png'},
    {'name': 'Clock Cream', 'kind': 'clock', 'rarity': 'common', 'image_url': '/game/furniture/clock_cream.png'},
    {'name': 'Clock Hanging', 'kind': 'clock', 'rarity': 'common', 'image_url': '/game/furniture/clock_hanging.png'},
    {'name': 'Globe', 'kind': 'globe', 'rarity': 'epic', 'image_url': '/game/furniture/globe.png'},
    {'name': 'Frame Leaf', 'kind': 'frame', 'rarity': 'epic', 'image_url': '/game/furniture/frame_leaf.png'},
    {'name': 'Frame Landscape', 'kind': 'frame', 'rarity': 'epic', 'image_url': '/game/furniture/frame_landscape.png'},
    {'name': 'Corkboard', 'kind': 'corkboard', 'rarity': 'epic', 'image_url': '/game/furniture/corkboard.png'},
    {'name': 'Books Stack', 'kind': 'books', 'rarity': 'epic', 'image_url': '/game/furniture/books_stack.png'},
    {'name': 'Cat Figurine', 'kind': 'cat_figurine', 'rarity': 'epic', 'image_url': '/game/furniture/cat_figurine.png'},
    {'name': 'Diffuser', 'kind': 'diffuser', 'rarity': 'epic', 'image_url': '/game/furniture/diffuser.png'},
    {'name': 'Divider Wood Slats', 'kind': 'divider', 'rarity': 'epic', 'image_url': '/game/furniture/divider_wood_slats.png'},
    {'name': 'Divider White Slats', 'kind': 'divider', 'rarity': 'epic', 'image_url': '/game/furniture/divider_white_slats.png'},
    {'name': 'Divider Frame Vine', 'kind': 'divider', 'rarity': 'epic', 'image_url': '/game/furniture/divider_frame_vine.png'},
    {'name': 'Divider Folding Screen', 'kind': 'divider', 'rarity': 'epic', 'image_url': '/game/furniture/divider_folding_screen.png'},
    {'name': 'Divider Plant Shelf', 'kind': 'divider', 'rarity': 'epic', 'image_url': '/game/furniture/divider_plant_shelf.png'},
    {'name': 'Mirror Standing', 'kind': 'mirror', 'rarity': 'epic', 'image_url': '/game/furniture/mirror_standing.png'},
    {'name': 'Coat Rack', 'kind': 'coat_rack', 'rarity': 'epic', 'image_url': '/game/furniture/coat_rack.png'},
    {'name': 'Laundry Basket', 'kind': 'laundry_basket', 'rarity': 'epic', 'image_url': '/game/furniture/laundry_basket.png'},
    {'name': 'Trash Can', 'kind': 'trash', 'rarity': 'epic', 'image_url': '/game/furniture/trash_can.png'},
    {'name': 'Mini Fridge', 'kind': 'mini_fridge', 'rarity': 'epic', 'image_url': '/game/furniture/mini_fridge.png'},
    {'name': 'Wire Board Vine', 'kind': 'wire_board', 'rarity': 'epic', 'image_url': '/game/furniture/wire_board_vine.png'},
    {'name': 'Bean Bag', 'kind': 'bean_bag', 'rarity': 'epic', 'image_url': '/game/furniture/bean_bag.png'},
]

def seed():
    with app.app_context():
        by_name = {f.name: f for f in Furniture.query.all()}
        added = 0
        updated = 0
        for item in CATALOG:
            zone = 'wall' if item['kind'] in WALL_KINDS else 'floor'
            existing = by_name.get(item['name'])
            if existing:
                # Self-healing: keep catalog rows in sync with this file
                # (e.g. picks up placement_zone on a re-run after an update)
                # instead of silently skipping them forever.
                changed = False
                for field in ('kind', 'rarity', 'image_url'):
                    if getattr(existing, field) != item[field]:
                        setattr(existing, field, item[field])
                        changed = True
                if existing.placement_zone != zone:
                    existing.placement_zone = zone
                    changed = True
                if changed:
                    updated += 1
                continue
            db.session.add(Furniture(
                name=item["name"],
                kind=item["kind"],
                rarity=item["rarity"],
                image_url=item["image_url"],
                placement_zone=zone,
            ))
            added += 1
        db.session.commit()
        print(
            f"Added {added} new furniture item(s), updated {updated} existing one(s). "
            f"{len(by_name) + added} total in catalog."
        )

if __name__ == "__main__":
    seed()
