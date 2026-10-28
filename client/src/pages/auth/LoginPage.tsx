import { useState, type FormEvent } from "react";
import {
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailIcon,
} from "../../components/icons";
import { AuthLayout } from "./AuthLayout";
import { useNavigate } from "react-router";
import { apiFetch, TOKEN_KEY } from "../../lib/api";

export function LoginPage() {
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const data = await apiFetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      localStorage.setItem(TOKEN_KEY, data.access_token);
      navigate("/", { replace: true });
    } catch (error: unknown) {
      setMessage(
        error instanceof Error ? error.message : "There was an error logging you in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      headline="Every deck you're studying, in one place."
      eyebrow="Flashcards, notes and AI-generated quizzes for every subject — sign in to pick up where you left off."
    >
      <h1 className="font-display m-0 mb-1.5 text-[23px] font-medium text-ink">Welcome back</h1>
      <p className="m-0 mb-7 text-[13px] text-ink-muted">Sign in to continue to Deckly.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-dim">Email</span>
            <span className="flex h-9.5 items-center gap-2 rounded-[6px] border-[1.5px] border-line-strong bg-input px-2.75 focus-within:border-ink focus-within:shadow-[2px_2px_0_0_var(--color-violet)]">
              <MailIcon size={15} className="text-ink-faint" />
              <input
                type="text"
                placeholder="you.1"
                autoComplete="username"
                name="username"
                required
                className="min-w-0 flex-1 border-none bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
              />
            </span>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-dim">Password</span>
            <span className="flex h-9.5 items-center gap-2 rounded-[6px] border-[1.5px] border-line-strong bg-input px-2.75 focus-within:border-ink focus-within:shadow-[2px_2px_0_0_var(--color-violet)]">
              <LockIcon size={15} className="text-ink-faint" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                name="password"
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

        <div className="-mt-1.5 mb-5 flex items-center justify-between">
          <label className="flex items-center gap-1.75 text-[12.5px] text-ink-dim">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-3.5 w-3.5 accent-violet"
            />
            <span>Remember me</span>
          </label>
          <button
            type="button"
            disabled
            title="Not available yet"
            className="cursor-not-allowed text-[12.5px] text-ink-faint opacity-60"
          >
            Forgot password?
          </button>
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
          <span>{isSubmitting ? "Signing in..." : "Sign in"}</span>
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
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          className="font-medium text-ink"
        >
          Create one
        </button>
      </p>
    </AuthLayout>
  );
}
