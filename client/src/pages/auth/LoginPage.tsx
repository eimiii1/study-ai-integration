import { Link } from "react-router";
import AuthField from "../../components/auth/AuthField";
import AuthLayout from "../../layout/AuthLayout";
import { api } from "../../api/client";

export default function LoginPage() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget)

    const username = formData.get('username')
    const password = formData.get('password')

    const response = await api('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    })

    window.location.href = '/'
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
      <p className="mt-1 text-muted">Log in to get back to your decks.</p>

      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthField label="Username" name="username" />
        <AuthField label="Password" name="password" type="password" />

        <button
          type="submit"
          className="mt-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-ink/85"
        >
          Log in
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        No account?{" "}
        <Link to="/register" className="font-medium text-ink hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}