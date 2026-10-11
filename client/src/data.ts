import type {
  AgentTab,
  DeckCard,
  ExploreDeck,
  NavItem,
  QuickAction,
} from "./types";

export const navItems: NavItem[] = [
  { label: "Home", icon: "home", active: true },
  { label: "Decks", icon: "decks" },
  { label: "Profile", icon: "profile" },
];

export const agentTabs: AgentTab[] = [
  { name: "Rune", icon: "spark", active: true },
  { name: "Aether", icon: "circle" },
  { name: "Syntax", icon: "circle" },
  { name: "Theo", icon: "circle" },
  { name: "Clara", icon: "circle" },
];

export const quickActions: QuickAction[] = [
  { label: "Create a deck", icon: "decks" },
  { label: "Generate a quiz", icon: "quiz" },
  { label: "Add flashcard", icon: "card" },
  { label: "Add note", icon: "note" },
  { label: "Upload notes", icon: "upload" },
];

export const recentDecks: DeckCard[] = [
  {
    id: "1",
    avatarColors: ["violet", "pink"],
    title: "Organic Chemistry — Unit 4",
    cardCount: 48,
  },
  {
    id: "2",
    avatarColors: ["blue", "teal"],
    title: "Spanish Vocabulary: Travel",
    cardCount: 32,
  },
  {
    id: "3",
    avatarColors: ["pink", "orange", "violet", "teal", "green"],
    title: "World History: Cold War",
    cardCount: 61,
  },
  {
    id: "4",
    avatarColors: ["orange", "violet", "blue"],
    title: "Calculus II: Integrals",
    cardCount: 27,
  },
];

export const exploreDecks: ExploreDeck[] = [
  {
    id: "biology",
    name: "Biology 101",
    iconBg: "#5a56e8",
    iconLetter: "B",
    description:
      "Core concepts in cell biology, genetics and evolution. Built for intro cours…",
    trending: true,
  },
  {
    id: "vocab",
    name: "SAT Vocabulary",
    iconBg: "#4a154b",
    iconLetter: "V",
    description:
      "800 high-frequency SAT words with example sentences and quick-fire quizzes…",
  },
  {
    id: "history",
    name: "AP World History",
    iconBg: "#1f1f21",
    iconLetter: "H",
    description:
      "Unit-by-unit timeline decks covering every AP World History period, 1200–pres…",
  },
  {
    id: "discretemath",
    name: "Discrete Math",
    iconBg: "#1a7a42",
    iconLetter: "M",
    description:
      "Logic, set theory, combinatorics and graphs — built for a first discrete math…",
    trending: true,
  },
];
