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

export interface LoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

interface LoginPageProps {
  onSubmit?: (values: LoginFormValues) => void;
  onGoToRegister?: () => void;
}

export function LoginPage({ onSubmit, onGoToRegister }: LoginPageProps) {
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null)

  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget)
    const username = formData.get('username')
    const password = formData.get('password')

    const TOKEN_KEY = 'token'

    try {
      const response = await fetch('http://127.0.0.1:5001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      })

      if (!response.ok) {
        setMessage('There was an error logging you in.')
      }

      const data = await response.json()

      localStorage.setItem(TOKEN_KEY, data.access_token)
      navigate('/', { replace: true })
    } catch (error: any) {
      setMessage(error.message)
    }
  }

  return (
    <AuthLayout
      headline="Every deck you're studying, in one place."
      eyebrow="Rune turns your notes into flashcards and quizzes — sign in to pick up where you left off."
    >
      <h1 className="m-0 mb-1.5 text-[22px] font-medium text-ink">Welcome back</h1>
      <p className="m-0 mb-7 text-[13px] text-ink-muted">Sign in to continue to Deckly.</p>

      <form onSubmit={handleSubmit}>
        <div className="mb-5 flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-[12.5px] font-medium text-ink-dim">Email</span>
            <span className="flex h-9.5 items-center gap-2 rounded-lg border border-line bg-input px-2.75 focus-within:border-violet">
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
            <span className="flex h-9.5 items-center gap-2 rounded-lg border border-line bg-input px-2.75 focus-within:border-violet">
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
          <button type="button" className="text-[12.5px] text-ink-dim hover:text-ink">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="mb-5 flex h-10 w-full items-center justify-center gap-1.5 rounded-lg bg-violet text-[13.5px] font-semibold text-app hover:bg-violet-strong"
        >
          <span>Sign in</span>
          <ArrowRightIcon size={14} />
        </button>
      </form>

      <div className="mb-5 flex items-center gap-2.5 before:h-px before:flex-1 before:bg-hairline after:h-px after:flex-1 after:bg-hairline">
        <span className="text-[11.5px] text-ink-faint">or continue with</span>
      </div>

      <div className="mb-7 flex gap-2.5">
        <button className="flex h-9.5 flex-1 items-center justify-center rounded-lg border border-line bg-panel text-[12.5px] text-ink-dim hover:bg-panel-hover hover:text-ink">
          Google
        </button>
        <button className="flex h-9.5 flex-1 items-center justify-center rounded-lg border border-line bg-panel text-[12.5px] text-ink-dim hover:bg-panel-hover hover:text-ink">
          Microsoft
        </button>
      </div>

      <p className="m-0 text-center text-[12.5px] text-ink-muted">
        Don't have an account?{" "}
        <button type="button" onClick={onGoToRegister} className="font-medium text-ink">
          Create one
        </button>
      </p>
    </AuthLayout>
  );
}
