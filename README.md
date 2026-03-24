# PocketSpells

A mobile-friendly spell tracker for D&D players.

**[Try it live →](https://pocket-spells.vercel.app/)**

## What is this?

PocketSpells helps D&D players (especially new ones) track their spells during sessions. Search, filter, mark spells as prepared, and track spell slots.

## Why?

I built PocketSpells for my friend Amalie, a Ranger player who prefers tracking her character on paper but found spell management difficult during sessions.

The goal was to create a simple mobile-friendly tool for quickly checking spells, marking them as prepared, and tracking spell slots without adding complexity.

## Features in v1

- Search and filter SRD spells
- Mark spells as prepared (saved in your pocket)
- Track spell slots during play
- Add and manage custom spells
- Save spell data locally with localStorage
- Mobile-first interface designed for use during sessions

## Tech Stack

- React + TypeScript
- Vite
- TanStack Query
- shadcn/ui
- Tailwind CSS
- localStorage
- [5e-bits API](https://5e-bits.github.io/docs/) (SRD spells)

## Technical notes

- TanStack Query is used to reduce unnecessary API requests and handle remote spell data efficiently with caching
- localStorage keeps the app simple while preserving prepared spells and spell slot state between sessions
- The UI is designed mobile-first because the primary use case is playing during live sessions
