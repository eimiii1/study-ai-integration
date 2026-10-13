export interface NavItem {
  label: string;
  icon: string;
  to: string;
}

export interface AgentTab {
  name: string;
  icon: string;
  active?: boolean;
}

export interface QuickAction {
  label: string;
  icon: string;
}

export interface Deck {
  id: number;
  title: string;
  description: string;
  parent_deck_id: number | null;
  subdeck_count: number;
  card_count: number;
}

export interface DeckCard {
  id: string;
  avatarColors: string[];
  title: string;
  cardCount: number;
}

export interface ExploreDeck {
  id: string;
  name: string;
  iconBg: string;
  iconLetter: string;
  description: string;
  trending?: boolean;
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

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
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
