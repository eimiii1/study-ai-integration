import { Link } from "react-router";
import AuthLayout from "../../layout/AuthLayout";
import AuthField from "../../components/auth/AuthField";
import { api } from "../../api/client";

export default function RegisterPage() {
  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')

    const data = await api("/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password })
    })

    window.location.href = '/login'
  }

  return (
    <AuthLayout>
      <h2 className="font-serif text-2xl mb-1">Create your account</h2>
      <p className="text-bone/60 mb-10">Start building your first deck.</p>

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <AuthField label="Username" name="username" />
        <AuthField label="Email address" name="email" type="email" />
        <AuthField label="Password" name="password" type="password" />

        <button
          type="submit"
          className="mt-2 bg-bone text-chalk text-sm font-medium px-5 py-3.5 rounded-sm transition duration-200 hover:bg-gilt hover:-translate-y-0.5"
        >
          Create account
        </button>
      </form>

      <p className="mt-8 text-sm text-bone/60">
        Already have an account?{" "}
        <Link to="/login" className="text-gilt hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}