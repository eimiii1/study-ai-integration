import { Link } from "react-router";
import AuthLayout from "../../layout/AuthLayout";
import AuthField from "../../components/auth/AuthField";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <h2 className="font-serif text-2xl mb-1">Create your account</h2>
      <p className="text-bone/60 mb-10">Start building your first deck.</p>

      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          // TODO: wire up register API
        }}
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