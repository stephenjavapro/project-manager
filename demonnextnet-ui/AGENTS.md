<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project: DemoNextNet UI

## Overview

This is the frontend for a full-stack demo project. It consumes a .NET 8 Web API (`DemoNextNet.Api`) running locally at `http://localhost:5106`.

## Tech Stack

- Next.js (App Router)
- TypeScript
- SCSS Modules for styling (no Tailwind, no CSS-in-JS)
- React Compiler enabled

## Conventions

- All styles are written in `.module.scss` files scoped to their component
- No global utility classes — layout and styling logic lives in the component's module
- Components live in `src/components/` and are organized by feature
- API calls are centralized in `src/lib/api.ts`
- Types and interfaces live in `src/types/`

## API

- Base URL: `http://localhost:5106`
- Endpoints follow REST conventions for `ProjectItems` and `TaskItems`
- A `ProjectItem` contains a list of `TaskItem` children

## Notes

- Do not suggest Tailwind classes
- Do not suggest CSS-in-JS solutions
- Prefer async/await over `.then()` chains
