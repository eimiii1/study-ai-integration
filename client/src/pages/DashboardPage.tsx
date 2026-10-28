import { DeckPreviewGrid } from "../components/DeckPreviewGrid";
import { DashboardHero } from "../components/DashboardHero";
import { useDecks } from "../hooks/useDecks";

const Dashboard = () => {
  const { decks, isLoading, error, refetch } = useDecks();

  return (
    <div className="flex-1 overflow-y-auto">
      <DashboardHero decks={decks} />
      <DeckPreviewGrid decks={decks} isLoading={isLoading} error={error} refetch={refetch} />
    </div>
  );
};

export default Dashboard;
