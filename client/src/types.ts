export interface NavItem {
  label: string;
  icon: string;
  to: string;
}

export interface Deck {
  id: number;
  title: string;
  description: string;
  parent_deck_id: number | null;
  subdeck_count: number;
  card_count: number;
}

export interface User {
  id: number,
  username?: string,
  email: string
}

// NOTE: field names below (front/back, title/content, questions/options/answer)
// are my assumptions about the backend's JSON. If they differ, this is the only
// place (plus the form field names in the tabs) that needs to change.
export interface Flashcard {
  id: number;
  deck_id: number;
  front: string;
  back: string;
}
export type FlashcardInput = Pick<Flashcard, "front" | "back">;

export interface Note {
  id: number;
  deck_id: number;
  title: string;
  content: string;
}
export type NoteInput = Pick<Note, "title" | "content">;

export type QuestionType = "multiple_choice" | "identification" | "fill_in_blank";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface QuizQuestion {
  // The backend question id — needed to submit an answer for grading.
  id: number;
  type: QuestionType;
  question: string;
  // null for identification/fill_in_blank — those are typed, not chosen.
  options: string[] | null;
  // Client-known answer, used only to pick an option's highlight color while
  // waiting on the server response; the server's grading is what counts.
  answer: string;
  explanation?: string;
  difficulty?: QuestionDifficulty;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface DeckOutletContext {
  deck: Deck;
  subdecks: Deck[];
  createDeck: (
    title: string,
    description?: string,
    parentDeckId?: number,
  ) => Promise<Deck>;
}

export type FurnitureRarity = "common" | "rare" | "epic";

export type PlacementZone = "floor" | "wall";
export type WallSide = "left" | "right";

export interface FurnitureItem {
  id: number;
  name: string;
  kind: string;
  rarity: FurnitureRarity;
  image_url: string;
  placement_zone: PlacementZone;
}

export interface InventoryItem extends FurnitureItem {
  quantity: number;
  placed: number;
  available: number;
}

// x/y are GRID coordinates (see lib/roomGrid.ts), not pixels or percentages.
// For a floor item, wall_side is null and x/y are the tile column/row.
// For a wall item, wall_side says which back wall it's on and x is the slot
// index along that wall (y is unused).
export interface RoomItem extends FurnitureItem {
  room_item_id: number;
  furniture_id: number;
  x: number;
  y: number;
  wall_side: WallSide | null;
  z_index: number;
  flipped: boolean;
  scale: number;
}
