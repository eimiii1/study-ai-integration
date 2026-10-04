const API_URL = "http://127.0.0.1:500/api";

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token')

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type" : "application/json",
            ...(token && {Authorization: `Bearer ${token}`}),
            ...options.headers,
        }
    })

    const data = await res.json().catch(() => null)
    if (!res.ok)
        throw new Error(data?.error ?? `Request failed (${res.status})`)
    
    return data
}