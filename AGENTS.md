# AGENTS.md

This is the entry point for any AI agent working on this project. Read this file first, then follow the load order before touching code.

---

## What this project is

Interactive Priority Matrix is a React/Vite prototype for prioritization UX exploration, exported from Figma and adapted for browser-based interaction and testing.

**Stack:** React 18, TypeScript, Vite, Radix UI, Tailwind-style utility classes

---

## Load order

Read these files before starting any task:

| Priority | File | Why |
|---|---|---|
| 1 - always | `README.md` | High-level project purpose and run flow |
| 2 - always | `package.json` | Scripts and dependency surface |
| 3 - before frontend work | `/home/matt99is/projects/vault/Patterns/frontend-standards.md` | Before any frontend or UI work |
| 3 - for app behavior | `src/App.tsx` | Main composition and routing of prototype behavior |
| 4 - for feature logic | `src/components/InteractivePriorityMatrix.tsx` | Core matrix component logic |
| 5 - for implementation conventions | `src/guidelines/Guidelines.md` | Figma-export baseline constraints |

---

## Startup Gate (Mandatory)

Before running commands, searching code, or editing files, every agent must:

1. Read this `AGENTS.md`.
2. Read `README.md`.
3. Read `package.json`.
4. Read vault project note: `/home/matt99is/projects/vault/Projects/Interactiveprioritymatrix.md`.
5. Read vault governance note: `/home/matt99is/projects/vault/Patterns/vault-note-governance.md`.
6. In the first response of the session, explicitly confirm these files were loaded.

If any step is missed, stop and complete it before continuing.

---

## Vault Note Contract (Anti-Bloat)

The vault project note at `/home/matt99is/projects/vault/Projects/Interactiveprioritymatrix.md` is startup memory, not history.

### Fixed purpose
- Keep only current operating truth needed to start work quickly.
- Keep active decisions, current gotchas, and near-term next steps.
- Do not use it as a changelog, release log, or commit diary.

### Hard limits
- Max 220 lines.
- Max 14,000 characters.
- Required `##` sections:
  - `What it is`
  - `Current status`
  - `Active decisions`
  - `Known gotchas`
  - `Next steps`
  - `References`
- Bullet caps:
  - `Current status`: 12 bullets max
  - `Active decisions`: 8 bullets max
  - `Known gotchas`: 8 bullets max
  - `Next steps`: 6 bullets max
  - `References`: 12 bullets max

### Update rule
- Replace existing bullets when state changes; do not append chronological entries.
- Keep one bullet per capability/state, written as present tense current truth.
- Move durable history to repo docs.

### Archive policy
- Default: no rolling archive notes.
- Optional: one manual snapshot before major rewrites, only on explicit user request.

---

## Key commands

```bash
npm install
npm run dev
npm run build
```

---

## Critical gotchas

- This project has no test/lint scripts in `package.json`; add them intentionally before relying on CI-style checks.
- The `src/imports/` layer contains generated files and unusual names; minimize broad renames/refactors.
- Validate desktop and mobile behavior whenever UI structure changes because the prototype is interaction-first.

---

## Repo structure

```
AGENTS.md
README.md
package.json
src/
|-- App.tsx
|-- main.tsx
|-- components/InteractivePriorityMatrix.tsx
|-- imports/                  # Generated/imported component assets
|-- guidelines/Guidelines.md
index.html
vite.config.ts
```
