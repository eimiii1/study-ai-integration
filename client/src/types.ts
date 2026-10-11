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
