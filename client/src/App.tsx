import type { ReactNode } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useNavigate,
} from "react-router";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import Dashboard from "./pages/DashboardPage";

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


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}