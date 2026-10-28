# API Reference

All endpoints are prefixed with `/api`. Protected routes require a valid JWT in the `Authorization: Bearer <token>` header.

## Auth

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/register` | Create a new user account | No |
| POST | `/api/login` | Log in and receive a JWT access token | No |
| GET | `/api/me` | Get the current logged-in user's info | Yes |

## Decks

Decks support **one level of nesting**. Pass `parent_deck_id` when creating a deck to make it a subdeck of an existing top-level deck. Subdecks cannot be edited directly, and cannot have their own subdecks. Deleting a deck cascades — it deletes its subdecks, flashcards, notes, and quiz.

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/decks` | Create a new deck (optionally pass `parent_deck_id` to create a subdeck) | Yes |
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

<<<<<<< HEAD
A quiz is generated automatically from a deck's flashcards via the Groq API — there's no manual quiz-creation route. The first call to `/study` generates and saves the quiz; later calls return the saved version instead of calling the AI again. The generator mixes three question types across a quiz — `multiple_choice`, `identification`, and `fill_in_blank` — choosing per-flashcard based on how the content fits; each question also gets a `difficulty` and an `explanation`. Answers are graded server-side, since grading is also what decides furniture drops.
=======
A quiz is generated automatically from a deck's flashcards via the Groq API — there's no manual quiz-creation route. The first call to `/study` generates and saves the quiz; later calls return the saved version instead of calling the AI again.
>>>>>>> 3b73fe78eb4e48326814e83857dbf3f31bfa8e57

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/api/decks/<deck_id>/study` | Get (or generate, on first call) the quiz for a deck | Yes |
| POST | `/api/decks/<deck_id>/study/answer` | Submit an answer to a question (`question_id`, `answer`); returns whether it was correct, the correct answer, the explanation, and anything awarded | Yes |

## Furniture & Room

Furniture is earned by answering quiz questions correctly (see `POST /study/answer` above — there's no separate "claim a reward" route). Each `Furniture` item has a `rarity` (`common`/`rare`/`epic`) and a `placement_zone` of `floor` or `wall`, which decides where in the room grid it's allowed to go. The room is a 6x6 floor grid plus two walls (`left`/`right`), each with 6 slots.

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| GET | `/api/furniture` | List the full furniture catalog (owned or not) | Yes |
| GET | `/api/furniture/inventory` | List what the current user owns, with quantity owned, how many are currently placed, and how many are free to place | Yes |
| GET | `/api/room` | Get everything currently placed in the user's room | Yes |
| POST | `/api/room` | Place an owned item in the room. Body: `furniture_id` (required), plus `x`/`y`/`wall_side` to choose a spot, or omit them to auto-place in the first open tile/slot | Yes |
| PUT | `/api/room/<item_id>` | Update a placed item — move it (`x`, `y`, `wall_side`), flip it (`flipped`), or resize it (`scale`, clamped to 60–140) | Yes |
| DELETE | `/api/room/<item_id>` | Remove a placed item and return it to inventory | Yes |

Placement is validated server-side: an item can't go in the wrong zone (a wall-only item onto the floor, or vice versa), outside the grid, or onto a tile/slot another item already occupies.