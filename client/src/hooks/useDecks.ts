import { useCallback, useEffect, useState } from "react";
import type { Deck } from "../types";

const API_BASE = 'http://192.168.100.7:5001'
const TOKEN_KEY = 'token'

type useDecksResult = {
    decks: Deck[];
    isLoading: boolean;
    error: string | null;
    refetch: () => void;
}

export const useDecks = (): useDecksResult => {
    const [decks, setDecks] = useState<Deck[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchDecks = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem(TOKEN_KEY)
            const response = await fetch(`${API_BASE}/api/decks`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (!response.ok) {
                throw new Error("Failed to load decks.")
            }

            const data = await response.json()
            setDecks(data)
        } catch (err: any) {
            setError(err.message ?? "Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDecks()
    }, [fetchDecks])

    return { decks, isLoading, error, refetch: fetchDecks }
}