import { Link } from "react-router";
import AuthField from "../../components/auth/AuthField";
import AuthLayout from "../../layout/AuthLayout";

export default function RegisterPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: wire up register API
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-semibold tracking-tight">Create your account</h2>
      <p className="mt-1 text-muted">Start building your first deck.</p>

      <form className="mt-8 flex flex-col gap-5" onSubmit={handleSubmit}>
        <AuthField label="Username" name="username" />
        <AuthField label="Email address" name="email" type="email" />
        <AuthField label="Password" name="password" type="password" />

        <button
          type="submit"
          className="mt-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-paper transition hover:bg-ink/85"
        >
          Create account
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-ink hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}