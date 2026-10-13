import { Hero } from "../components/Hero";
import { RecentDecks } from "../components/RecentDecks";
import { TopBar } from "../components/TopBar";
import { useDecks } from "../hooks/useDecks";

// NOTE: ExploreDecks isn't wired in here — it's static placeholder data with
// no matching backend concept (no "explore/community decks" endpoint exists).
// The file is left untouched in components/ in case you want to build that
// feature later; import { ExploreDecks } from "../components/ExploreDecks";

const Dashboard = () => {
  const { decks, isLoading, error, refetch } = useDecks();

  return (
    <>
      <TopBar />
      <div className="flex-1 overflow-y-auto pb-8">
        <Hero />
        <RecentDecks decks={decks} isLoading={isLoading} error={error} refetch={refetch} />
      </div>
    </>
  );
};

export default Dashboard;
