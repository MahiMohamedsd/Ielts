# The Algerian's IELTS Playbook — Companion Website

Free, mobile-first, bilingual (English primary, Arabic secondary) practice companion for
*The Algerian's IELTS Playbook*. No login, no payment, no backend — all content ships as static
JSON, scoring runs entirely client-side, and progress is saved to `localStorage` only.

## Sections

- `/` — home, "how to use this with your book", links to all four sections
- `/listening` — 4 parts (40 questions), each with an audio player + auto-scoring
- `/reading` — the full passage (not printed in the book) + 13 auto-marked questions
- `/writing` — Task 1 and Task 2, two model answers each, collapsed behind a reveal toggle
- `/vocabulary` — 160-word list across 8 themes, as EN/AR/FR flashcards with a self-test mode

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

All exam content (scripts, passage, model answers, vocabulary) lives in `/content/*.json` so it
can be edited without touching component code.

## Audio

The Listening page expects real MP3 recordings at `/public/audio/listening-part{1..4}.mp3` (see
`public/audio/README.md`). Until those are added, the player automatically falls back to the
browser's built-in text-to-speech (Web Speech API) so the page stays fully usable end to end —
swap in recorded or TTS-generated MP3s at any time with no code changes.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, using the book's brand tokens
(`app/globals.css`) for colors, fonts (Poppins/Lora via `next/font/google`), and the
tip/mistake/example/vocab box system.
