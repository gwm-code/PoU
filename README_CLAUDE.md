# Mistheart — Modularized for Claude

This package splits your monolithic `mistheart-modularv134.tsx` into multiple small files so you can
continue editing in `claude.ai` without hitting the artifact limit. Each file is small enough to
be added as its own artifact and edited "in place" (Claude will not rewrite the whole code).

## How to use with Claude

1) Start a fresh Claude chat.
2) Drag `src/constants.ts` in first. Say:
   "This is 1 of several Mistheart modules. I'll add the rest next; treat them as one project and only edit specific functions."
3) Add the rest of the files from `src/` one-by-one (or in small batches). Keep each file under ~80–100 KB.
4) Finally, paste your UI layer into `src/MistheartGame.tsx` (copy from your original). Keep rendering/React logic separate from systems.
5) When asking for changes, target the specific file and function, e.g.:
   "Open `src/systems/CombatSystem.ts` and modify `executeAction` to add elemental resistances. Do not rewrite other files."

## Notes

- Some files may contain `// TODO: Paste ...` lines if the extractor couldn't find a section. Copy the corresponding section from the original.
- If you prefer, you can split further (e.g., one class per file in `/systems`).
- For TypeScript correctness, consider adding minimal interfaces/types gradually as you edit.

Happy building!
