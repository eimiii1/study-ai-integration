import {useState} from 'react'

type LoginFormProps = {
    onRegister: () => void;
}

const SignInForm = ({ onRegister }: LoginFormProps) => {
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget)

        const response = await fetch('http://127.0.0.1:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify({
                username: formData.get('username'),
                password: formData.get('password')
            })
        })
        
        if (!response.ok) {
            const data = await response.json()
            setMessage(data.error)
        }
        
        window.location.href = '/'
        const data = await response.json()
        localStorage.setItem('token', data.access_token)
    }
    return (
        <div className="flex flex-col">
            <h2 className="font-serif text-2xl mb-1">
                Welcome Back
            </h2>
            <p className="text-bone/60 mb-10">
                Sign In to get back to your decks.
            </p>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
            >
                <label className="flex flex-col gap-2">
                    <span className="text-sm text-bone/70">
                        Username
                    </span>

                    <input
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="bg-transparent border-0 border-b border-bone/15 pb-2.5 text-base outline-none transition focus:border-gilt/15"
                    />
                </label>
                <label className="flex flex-col gap-2">
                    <span className="text-sm text-bone/70">
                        Password
                    </span>

                    <input
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="
              bg-transparent
              border-0 border-b border-bone/15
              pb-2.5
              text-base
              outline-none
              transition
              focus:border-gilt/15
            "
                    />
                </label>

                <button
                    type="submit"
                    className="
            mt-2
            bg-bone text-obsidian
            text-sm font-medium
            px-5 py-3.5
            rounded-sm
            transition-all duration-200
            hover:bg-gilt
            hover:-translate-y-0.5
          "
                >
                    Sign In
                </button>
            </form>
            <p className="mt-8 text-sm text-bone/60">
                No account? {" "}
                <button
                    type="button"
                    onClick={onRegister}
                    className="text-gilt hover:underline"
                >
                    Create one
                </button>
            </p>
        </div>
    )
}

export default SignInForm