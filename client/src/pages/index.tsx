import { useEffect, useState } from 'react'

type User = {
    id: string,
    username: string,
    email: string
}

const Index = () => {
    const [user, setUser] = useState<User | null>(null)
    const [message, setMessage] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                const res = await fetch('http://127.0.0.1:5000/api/me', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (!res.ok) {
                    throw new Error(`Server responded with status: ${res.status}`)
                }

                const userData: User = await res.json()
                setUser(userData)
            } catch (e: any) {
                setMessage(e.message || 'Something went wrong while logging in.')
                setUser(null)
            }
        }

        fetchData()
    }, [])
    return (
        <>
            <div>
                {!user ?
                    (
                        <div>
                            Loading...
                        </div>
                    ) : (
                        <div>
                            {user?.id}
                            {user?.username}
                            {user?.email}
                        </div>
                    )
                }
            </div>
        </>
    )
}

export default Index