import type { ReactNode } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router";
import { ExploreDecks } from "./components/ExploreDecks";
import { Hero } from "./components/Hero";
import { RecentDecks } from "./components/RecentDecks";
import { Sidebar } from "./components/Sidebar";
import { TopBar } from "./components/TopBar";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";

const TOKEN_KEY = "token";

function isAuthenticated() {
  return Boolean(localStorage.getItem(TOKEN_KEY));
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function LoginRoute() {
  const navigate = useNavigate();
  return (
    <LoginPage
      onSubmit={(values) => {
        // TODO: replace with your real login API call; this is a stand-in
        // until the request succeeds and the server returns a JWT.
        console.log("login submit", values);
        localStorage.setItem(TOKEN_KEY, "dummy-jwt-token");
        navigate("/", { replace: true });
      }}
      onGoToRegister={() => navigate("/register")}
    />
  );
}

function RegisterRoute() {
  const navigate = useNavigate();
  return (
    <RegisterPage
      onSubmit={(values) => {
        // TODO: replace with your real register API call; this is a
        // stand-in until the request succeeds and returns a JWT.
        console.log("register submit", values);
        localStorage.setItem(TOKEN_KEY, "dummy-jwt-token");
        navigate("/", { replace: true });
      }}
      onGoToLogin={() => navigate("/login")}
    />
  );
}

function DashboardRoute() {
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

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}