import { ExploreDecks } from "../components/ExploreDecks";
import { Hero } from "../components/Hero";
import { RecentDecks } from "../components/RecentDecks";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-app">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex-1 overflow-y-auto pb-8">
          <Hero />
          <RecentDecks />
          <ExploreDecks />
        </div>
      </div>
    </div>
  );
}

export default Dashboard