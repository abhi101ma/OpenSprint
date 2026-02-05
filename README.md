# OpenSprint

OpenSprint is a community sprint platform that connects business problem-submitters with technical solvers. It includes:

- SEO-friendly public site (`/`, `/about`, `/how-it-works`, `/problems`, `/gallery`)
- Authenticated dashboard for managing problems, solver profiles, and sprint boards
- Lightweight admin console for moderation and gallery publishing

## Tech

- Next.js 14 App Router + TypeScript
- TailwindCSS (shadcn-style primitives)
- PostgreSQL + Prisma
- NextAuth (Credentials + Google OAuth)
- dnd-kit for Kanban drag-and-drop

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` with:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/opensprint"
   NEXTAUTH_SECRET="replace-me"
   GOOGLE_CLIENT_ID=""
   GOOGLE_CLIENT_SECRET=""
   ```
3. Generate + migrate + seed:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   npm run prisma:seed
   ```
4. Run app:
   ```bash
   npm run dev
   ```

## Useful scripts

- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run lint` — lint checks
- `npm run test` — unit tests (ordering logic)
- `npm run prisma:migrate` — create/apply migration
- `npm run prisma:seed` — seed demo data

## Architecture Notes

- Auth + role guards are centralized in `lib/auth.ts` and `lib/guards.ts`.
- Mutations primarily use server actions (`lib/actions.ts`, `lib/board-actions.ts`).
- Board ordering is persisted by recalculating per-column integer order.
- Uploads use local filesystem adapter (`lib/storage.ts`) with DB metadata in `Attachment`; can be swapped for S3 later.
- Prisma schema models users, problems, solver profiles, sprint board entities, comments, attachments, memberships, and solutions.

## Demo users after seeding

- Admin: `admin@opensprint.dev` / `password123`
- Owner: `owner@opensprint.dev` / `password123`
- Solver: `solver@opensprint.dev` / `password123`
