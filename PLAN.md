# PocketSpells (working title)


## The problem

My friend Amalie and I play DnD with friends. Amalie really likes to track her character on paper. But, to keep track of spells (she's a Ranger) can be a hassle. To remember which spells you have, what they do and which situation they are helpful. 

### What else we tried
We tried printing them on cards. This worked well, but we would always forget to print new ones when she learned something new. She also missed to have a list of all the spells she could choose from when leveling up.

## The solution

Build Amalie a mobile spell tracker that feels as simple as paper but solves the organization problems.

- It should feel as simple as paper, but let her search/filter and track spell slots
- It should just keep track of spells, nothing else
- It needs to be worded for new players
- It would be nice if it could also help new players deciding what spells to choose when leveling up, what to prepare and which to cast in a specific situation
    - This is not recomending spells, rather using a language the player understands. "Fun spell", "Attack a single target", "LOTS of damage"

### Notes

Amalie plays a ranger. This is NOT a class with a large amount of spells. She still found it difficult. I'm assuming other classes can have even bigger issues with this, but also that it is especially a problem for new players that maybe doesn't play that often 

## The plan

### Phase 1: Core MVP 

- Quick acces to spell details
- List all spells and filter + sort
- Search for spells
- Mark as learned/prepared
- Keep track of spell slots
- Save data locally (ready when app is opened)
- Long rest button (to restore spell slots)

#### Tech Choices

- React with TypeScript for user interactions
- React aria for standard components
- Vite for build
- Tailwind or scoped CSS?
- For phase one I will not be using Tanstack Query, as it would be overkill. I only fetch data when the app loads.
- Will use Tanstack Router if neccesary for routing  
- Data: Spell data will come from https://5e-bits.github.io/docs/. (All spells here are in the SRD, and can be used under the The Open Game License (OGL))
- Storage: Will use localStorage for phase 1. Phase 2 could include IndexedDB / Dexie  
- Hosting: Vercel (Haven't tried them yet, so should be fun)

#### Notes for phase 1