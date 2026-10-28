import type { ReactNode } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router";
import { AppLayout } from "./components/AppLayout";
import { isAuthenticated } from "./lib/api";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import Dashboard from "./pages/DashboardPage";
import { DeckPage } from "./pages/decks/DeckPage";
import { DecksPage } from "./pages/decks/DecksPage";
import { FlashcardsTab } from "./pages/decks/FlashcardsTab";
import { NotesTab } from "./pages/decks/NotesTab";
import { StudyTab } from "./pages/decks/StudyTab";
import { SubdecksTab } from "./pages/decks/SubdecksTab";
import { ProfilePage } from "./pages/ProfilePage";
import { RoomPage } from "./pages/RoomPage";
import { useState } from "react";
import { LoadingScreen } from "./components/LoadingScreen";

// Layout route: signed-in users get the sidebar shell, everyone else goes to /login.
function ProtectedRoute() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
}

// The room is a full-screen game view with no sidebar chrome, but still
// requires auth — same check as ProtectedRoute, just without the shell.
function RequireAuth({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route index element={<Dashboard />} />
          <Route path="decks" element={<DecksPage />} />
          <Route path="decks/:deckId" element={<DeckPage />}>
            <Route index element={<FlashcardsTab />} />
            <Route path="notes" element={<NotesTab />} />
            <Route path="subdecks" element={<SubdecksTab />} />
            <Route path="study" element={<StudyTab />} />
          </Route>
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="room"
          element={
            <RequireAuth>
              <RoomPage />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
