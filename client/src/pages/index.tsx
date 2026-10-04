import {useEffect, useState} from 'react'

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

            } catch (e) {
                
            }
        }   
    }, [])
    return (
        <>
            bakla
        </>
    )
}

export default Index