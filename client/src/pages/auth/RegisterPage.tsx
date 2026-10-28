import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "../../components/icons";
import { apiFetch, ApiError, TOKEN_KEY } from "../../lib/api";
import { AuthLayout } from "./AuthLayout";

// NOTE: the backend's /api/login expects "username" + "password" (see
// LoginPage), so registration collects a username rather than a display
// name — it's what you'll actually sign in with afterwards.
export function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    try {
      const data = await apiFetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
      });

      // Some backends hand back a token straight from /register; if not,
      // immediately log in with the credentials the user just chose.
      const token =
        data?.access_token ??
        (await apiFetch("/api/login", {
          method: "POST",
          body: JSON.stringify({ username, password }),
        }))?.access_token;

      if (!token) throw new Error("Account created, but signing you in failed.");

      localStorage.setItem(TOKEN_KEY, token);
      navigate("/", { replace: true });
    } catch (error: unknown) {
      if (error instanceof ApiError && error.status === 409) {
        setMessage("That username or email is already taken.");
      } else {
        setMessage(
          error instanceof Error ? error.message : "There was an error creating your account.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      headline="Turn your notes into decks you can actually quiz on."
      eyebrow="Create an account to start building flashcard decks and AI-generated quizzes."
    >
      <h1 className="font-display m-0 mb-1.5 text-[23px] font-medium text-ink">Create your account</h1>
      <p className="m-0 mb-7 text-[13px] text-ink-muted">Get started with Deckly for free.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-dim">Username</span>
            <span className="flex h-9.5 items-center gap-2 rounded-[6px] border-[1.5px] border-line-strong bg-input px-2.75 focus-within:border-ink focus-within:shadow-[2px_2px_0_0_var(--color-violet)] focus-within:shadow-[0_0_0_3px_rgba(182,81,47,0.18)]">
              <UserIcon size={15} className="text-ink-faint" />
              <input
                type="text"
                placeholder="jane.moore"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                minLength={3}
                required
                className="min-w-0 flex-1 border-none bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-dim">Email</span>
            <span className="flex h-9.5 items-center gap-2 rounded-[6px] border-[1.5px] border-line-strong bg-input px-2.75 focus-within:border-ink focus-within:shadow-[2px_2px_0_0_var(--color-violet)] focus-within:shadow-[0_0_0_3px_rgba(182,81,47,0.18)]">
              <MailIcon size={15} className="text-ink-faint" />
              <input
                type="email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="min-w-0 flex-1 border-none bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-dim">Password</span>
            <span className="flex h-9.5 items-center gap-2 rounded-[6px] border-[1.5px] border-line-strong bg-input px-2.75 focus-within:border-ink focus-within:shadow-[2px_2px_0_0_var(--color-violet)] focus-within:shadow-[0_0_0_3px_rgba(182,81,47,0.18)]">
              <LockIcon size={15} className="text-ink-faint" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
                className="min-w-0 flex-1 border-none bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
              />
              <button
                type="button"
                className="flex flex-shrink-0 p-0.5 text-ink-faint hover:text-ink-dim"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
            </span>
          </label>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <label className="flex items-center gap-1.75 text-[12.5px] text-ink-dim">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              required
              className="h-3.5 w-3.5 accent-violet"
            />
            <span>I agree to the Terms and Privacy Policy</span>
          </label>
        </div>

        {message && <p className="m-0 mb-3 text-[12.5px] text-danger">{message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mb-5 flex h-10 w-full items-center justify-center gap-1.5 rounded-[6px] border-[1.5px] border-ink bg-violet text-[13.5px] font-semibold text-[#fbf8ee] shadow-[var(--shadow-sticker-sm)] hover:bg-violet-strong active:translate-x-[2px] active:translate-y-[2px] active:shadow-none disabled:opacity-60"
        >
          {isSubmitting && (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-app/40 border-t-app" />
          )}
          <span>{isSubmitting ? "Creating account..." : "Create account"}</span>
          {!isSubmitting && <ArrowRightIcon size={14} />}
        </button>
      </form>

      <div className="mb-5 flex items-center gap-2.5 before:h-px before:flex-1 before:bg-hairline after:h-px after:flex-1 after:bg-hairline">
        <span className="text-[11.5px] text-ink-faint">or continue with</span>
      </div>

      <div className="mb-7 flex gap-2.5">
        <button
          type="button"
          disabled
          title="Not available yet"
          className="flex h-9.5 flex-1 cursor-not-allowed items-center justify-center rounded-[6px] border-[1.5px] border-line-strong bg-panel text-[12.5px] text-ink-faint opacity-60"
        >
          Google
        </button>
        <button
          type="button"
          disabled
          title="Not available yet"
          className="flex h-9.5 flex-1 cursor-not-allowed items-center justify-center rounded-[6px] border-[1.5px] border-line-strong bg-panel text-[12.5px] text-ink-faint opacity-60"
        >
          Microsoft
        </button>
      </div>

      <p className="m-0 text-center text-[12.5px] text-ink-muted">
        Already have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="font-medium text-ink"
        >
          Sign in
        </button>
      </p>
    </AuthLayout>
  );
}
