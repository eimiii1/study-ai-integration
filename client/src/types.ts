export interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
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