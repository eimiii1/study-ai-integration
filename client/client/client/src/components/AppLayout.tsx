import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";

// Persistent shell for every signed-in page: sidebar + whatever the route renders.
export function AppLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-app">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Outlet />
      </div>
    </div>
  );
}
