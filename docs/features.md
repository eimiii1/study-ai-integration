# Features Overview

## Auth

Register, log in, and a protected `/me` route. JWT-based — tokens are issued on login and sent in the `Authorization` header on protected requests.

## Decks & Subdecks

Decks organize flashcards and notes. A deck can optionally have **one level** of subdecks nested underneath it (no deeper nesting). Subdecks can't be edited and can't have their own subdecks. Deleting a deck cascades to everything inside it — subdecks, flashcards, notes, and its quiz.

## Flashcards

Simple front/back cards attached to a deck or subdeck. Full CRUD.

## Notes

Title + content, attached to a deck or subdeck. A deck can have any number of notes. Full CRUD.

## Quizzes (AI-generated)

Clicking "Study Deck" generates a quiz from that deck's flashcards via the Groq API — one question per flashcard, mixing multiple-choice, identification, and fill-in-the-blank. Each question also gets a difficulty rating and a short explanation of the correct answer. The quiz is generated once per deck and saved, so later study sessions reuse it instead of calling the AI again — until a flashcard in that deck is added, edited, or deleted, which invalidates the saved quiz so the next study session regenerates it from the current flashcards.

## Furniture Rewards & Room

Answering a quiz question correctly has a 50% chance to award the user a furniture item, weighted by rarity (common/rare/epic). Furniture ownership is tracked per user with a quantity, so earning a duplicate just increases its count instead of creating a new record.

The room (`/room`) is a full-screen isometric tile grid: a 6x6 floor plus two back walls, each with 6 slots. Every Furniture item is classified `placement_zone` floor or wall (frames, clocks, corkboards and wire boards are wall-only; everything else is floor-only), and the backend rejects placing an item on the wrong zone or on an already-occupied tile/slot. A placed item (RoomItem) can be flipped horizontally and resized (60%-140%); draw order (z_index) is recomputed from its tile position so items in front on the isometric grid correctly overlap items behind them.
The room (/room) is a full-screen isometric tile grid: a 6x6 floor plus two back walls, each with 6 slots. Every Furniture item is classified placement_zone floor or wall (frames, clocks, corkboards and wire boards are wall-only; everything else is floor-only), and the backend rejects placing an item on the wrong zone or on an already-occupied tile/slot. A placed item (RoomItem) can be flipped horizontally and resized (60%-140%); draw order (z_index) is recomputed from its tile position so items in front on the isometric grid correctly overlap items behind them.