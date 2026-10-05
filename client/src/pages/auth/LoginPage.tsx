import { Link } from "react-router";
import AuthLayout from "../../layout/AuthLayout";
import AuthField from "../../components/auth/AuthField";
import { api } from "../../api/client";

export default function LoginPage() {
    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)
    
        const username = formData.get('username')
        const password = formData.get('password')

        const data = await api('/login', {
          method: 'POST',
          body: JSON.stringify({username, password})
        })

        localStorage.setItem('token', data.access_token)
    
        window.location.href = '/'
    }
  return (
    <AuthLayout>
      <h2 className="font-serif text-2xl mb-1">Welcome back</h2>
      <p className="text-bone/60 mb-10">Log in to get back to your decks.</p>

      <form
        className="flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        <AuthField label="Username" name="username" />
        <AuthField label="Password" name="password" type="password" />

        <button
          type="submit"
          className="mt-2 bg-bone text-chalk text-sm font-medium px-5 py-3.5 rounded-sm transition duration-200 hover:bg-gilt hover:-translate-y-0.5"
        >
          Log in
        </button>
      </form>

      <p className="mt-8 text-sm text-bone/60">
        No account?{" "}
        <Link to="/register" className="text-gilt hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}