# Testing Guide

You can test the API using cURL if you don't have an API client like Postman. Otherwise, feel free to use Postman or your preferred API client instead.

```bash
curl -X <METHOD> http://127.0.0.1:5001/<ENDPOINT> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -d '{"key": "value"}'
```

- Swap `<METHOD>` and `<ENDPOINT>` for whichever route you're testing — see [API Reference](api-reference.md) for the full list.
- The `Authorization` header is only needed for routes marked "Yes" under Auth Required. Grab `<YOUR_TOKEN>` from the `/api/login` response.
- The `d` flag (request body) is only needed for `POST`/`PUT` requests that expect JSON data.

## A typical test flow

1. Register a user — `POST /api/register`
2. Log in — `POST /api/login` — copy the `access_token` from the response
3. Create a deck — `POST /api/decks`
4. Add a flashcard to it — `POST /api/decks/<deck_id>/flashcards`
5. Study the deck — `GET /api/decks/<deck_id>/study` (generates a quiz on first call)
6. Answer a question — `POST /api/decks/<deck_id>/study/answer` with `{"question_id": ..., "answer": ...}` — grading happens server-side, and a correct answer has a chance of awarding furniture
7. Check what you own — `GET /api/furniture/inventory`

## Notes

- The server listens on port **5001**, not Flask's usual 5000 (see `app.run(...)` in `server/app.py`) — double-check your base URL if you're getting connection-refused errors.
- Tokens expire (see `JWT_ACCESS_TOKEN_EXPIRES` in `config.py` — currently 24 hours). If a protected route suddenly starts returning `401`, log in again for a fresh token.
- Never paste a real token into a shared doc, commit, or public channel — treat it like a password.