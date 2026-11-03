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

// No `answer` field — the server deliberately withholds it until the
// question is actually graded (see server/routes/quizzes.py), so it isn't
// sitting in a network response before the player has answered.
export interface QuizQuestion {
  id: number;
  type: QuestionType;
  question: string;
  options: string[] | null;
  explanation?: string;
  difficulty?: QuestionDifficulty;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export type ChatMessage =
  | { id: string; role: "user"; kind: "text"; text: string }
  | { id: string; role: "user"; kind: "file"; fileName: string }
  | { id: string; role: "bot"; kind: "pending"; text: string }
  | { id: string; role: "bot"; kind: "text"; text: string }
  | { id: string; role: "bot"; kind: "error"; text: string }
  // The PDF became a real deck of flashcards — studying it (and any
  // furniture rewards) goes through the normal deck quiz flow, not a
  // chatbot-specific one.
  | { id: string; role: "bot"; kind: "deck"; deckId: number; title: string; cardCount: number };

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
