# API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid JWT in the `Authorization: Bearer <token>`header.

## Auth

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/register` | Create a new user account | No |
| POST | `/api/login` | Log in and receive a JWT access token | No |
| GET | `/api/me` | Get the current logged-in user's info | Yes |

## Decks

Decks support **one level of nesting**. Pass `parent_deck_id` when creating a deck to make it a subdeck of an existing top-level deck. Subdecks cannot be edited directly, and cannot have their own subdecks. Deleting a deck cascades — it deletes its subdecks, flashcards, notes, and quiz.

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/decks` | Create a new deck (optionally pass `parent_deck_id` to create a subdeck) | Yes |
| GET | `/api/decks` | List the current user's decks | Yes |
| PUT | `/api/decks/<deck_id>` | Update a deck (top-level decks only) | Yes |
| DELETE | `/api/decks/<deck_id>` | Delete a deck and everything nested inside it | Yes |

## Flashcards

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/decks/<deck_id>/flashcards` | Create a flashcard in a specific deck | Yes |
| GET | `/api/decks/<deck_id>/flashcards` | List all flashcards in a specific deck | Yes |
| GET | `/api/decks/<deck_id>/flashcards/<card_id>` | Get a single flashcard | Yes |
| PUT | `/api/decks/<deck_id>/flashcards/<card_id>` | Update a flashcard | Yes |
| DELETE | `/api/decks/<deck_id>/flashcards/<card_id>` | Delete a flashcard | Yes |

## Notes

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/decks/<deck_id>/notes` | Create a note in a specific deck | Yes |
| GET | `/api/decks/<deck_id>/notes` | List all notes in a specific deck | Yes |
| GET | `/api/decks/<deck_id>/notes/<note_id>` | Get a single note | Yes |
| PUT | `/api/decks/<deck_id>/notes/<note_id>` | Update a note | Yes |
| DELETE | `/api/decks/<deck_id>/notes/<note_id>` | Delete a note | Yes |

## Quizzes

A quiz is generated automatically from a deck's flashcards via the Groq API — there's no manual quiz-creation route. The first call to `/study` generates and saves the quiz; later calls return the saved version instead of calling the AI again.

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/api/decks/<deck_id>/study` | Get (or generate, on first call) the quiz for a deck | Yes |

Currently supports multiple-choice questions only. Identification and fill-in-the-blank question types are modeled in the database (`question_type` column) but not yet generated.