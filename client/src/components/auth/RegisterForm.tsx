import { useState } from 'react'

type RegisterFormProps = {
    onLogin: () => void;
}

const RegisterForm = ({ onLogin }: RegisterFormProps) => {
    const [message, setMessage] = useState<string | null>(null)

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formData = new FormData(event.currentTarget)

        const response = await fetch('http://127.0.0.1:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password')
            })
        })

        const data = await response.json()
        if (!response.ok) {
            setMessage(data.error)
        }

        console.log(data)
    }

    return (
        <div className='flex flex-col'>
            <h2 className='font-serif text-2xl mb-1'>
                Create your account
            </h2>
            <p className='text-bone/60 mb-10'>
                Start building your first deck.
            </p>

            <form
                onSubmit={handleSubmit}
                className='flex flex-col gap-6'
            >
                <label className='flex flex-col gap-2'>
                    <span className='text-sm text-bone/70'>
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
                <label className='flex flex-col gap-2'>
                    <span className="text-sm text-bone/70">
                        Email Address
                    </span>
                    <input
                        name="email"
                        type="email"
                        autoComplete='email'
                        required
                        className='bg-transparent border-0 border-b border-bone/15 pb-2.5 text-base outline-none transition focus:border-gilt/15'
                    />
                </label>
                <label className='flex flex-col gap-2'>
                    <span className='text-sm text-bone/70'>
                        Password
                    </span>
                    <input
                        name="password"
                        type="password"
                        autoComplete="password"
                        required
                        className="bg-transparent border-0 border-b border-bone/15 pb-2.5 text-base outline-none transition focus:border-gilt/15"
                    />
                </label>

                <button
                    type='submit'
                    className='mt-2 bg-bone text-chalk text-sm font-medium px-5 py-3.5 rounded-sm transition-all duration-200 hover:bg-gilt hover:-translate-y-0.5'
                >
                    Create account
                </button>
            </form>

            <p className='mt-8 text-sm text-bone/60'>
                Already have an account? {" "}
                <button
                    type='button'
                    onClick={onLogin}
                    className='text-gilt hover:underline'
                >
                    Log in
                </button>
            </p>
        </div>
    )
}

export default RegisterForm