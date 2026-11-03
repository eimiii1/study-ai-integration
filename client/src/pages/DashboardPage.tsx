import { ChatPanel } from "../components/chatbot/ChatPanel";
import { DeckPreviewGrid } from "../components/DeckPreviewGrid";
import { DashboardHero } from "../components/DashboardHero";
import { useDecks } from "../hooks/useDecks";

// ChatPanel starts as a small box right here on the home page; it only
// takes over the screen (as a fixed overlay, so it adds no height here)
// once the user actually sends a message or a PDF. Until then, the rest
// of the dashboard below it stays visible and scrollable as normal.
const Dashboard = () => {
  const { decks, isLoading, error, refetch } = useDecks();

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-7 pt-6">
        <ChatPanel />
      </div>
      <DashboardHero decks={decks} />
      <DeckPreviewGrid decks={decks} isLoading={isLoading} error={error} refetch={refetch} />
    </div>
  );
};

export default Dashboard;
