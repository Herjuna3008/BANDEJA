# BANDEJA — AI Agent Handoff

> For: Claude Code, Codex GPT, or any AI agent resuming work on this project.
> Updated: 2026-05-27

---

## Project

Padel court booking platform. Next.js 16 full-stack app at `./bandeja/`. Features: Google OAuth auth, court/coach booking, matchmaking, 4 role-based dashboards, admin approval workflow.

**Working directory for all code changes:** `/Users/herjuna/Documents/GitHub/BANDEJA/bandeja/`

---

## Current State

| Area | Status |
|------|--------|
| Auth (Google OAuth) | ✅ Working |
| Database (MySQL/XAMPP) | ✅ Connected |
| Migrations | ⚠️ Needs `npm run db:migrate` if not yet run |
| Seed data | ⚠️ Needs `npm run db:seed` after migrate |
| Landing page | ✅ Done |
| Venues / Coaches / Matchmaking pages | ✅ Done |
| User dashboard | ✅ Done |
| Admin dashboard | ✅ Fixed (Server→Client icon/render errors resolved) |
| Venue Owner dashboard | ✅ Done |
| Coach dashboard | ✅ Done |
| Booking dialog (court) | ✅ UI done, no real payment gateway |
| Coach booking | ✅ UI done, no real payment gateway |
| Time slot blocking | ✅ Done — POST /api/bookings checks + blocks TimeSlot rows in transaction |
| Email notifications | ❌ Not implemented |
| Image uploads | ❌ Placeholder only |

---

## Stack (version-critical)

| Package | Version | Gotcha |
|---------|---------|--------|
| Next.js | 16.2.6 | `middleware.ts` → `proxy.ts`. Turbopack default. |
| React | 19.2.4 | Server/Client component boundary strictly enforced |
| Prisma | **6.19.3** | Downgraded from 7 — `url = env("DATABASE_URL")` is back in `schema.prisma` |
| @prisma/client | 6.19.3 | Simple `new PrismaClient()`, no adapter needed |
| next-auth | 5.0.0-beta.31 | Auth.js v5. `auth()` not `getServerSession()`. Config in `auth.ts` root |
| Tailwind | v4 | CSS-first config, no `tailwind.config.js` |
| Zod | v4 | `z.coerce.number()` breaks react-hook-form — use `z.string()` + convert manually |
| date-fns | v4 | Locale import: `import { id } from "date-fns/locale"` |

---

## Critical Rules (do not break these)

### 1. Server → Client component boundary
Never pass these from a Server Component to a Client Component:
- Lucide icon components (pass string key instead, see `StatsCard`)
- Functions / render callbacks (move to Client Component, see `*-table.tsx` pattern)
- Class instances

**Pattern for tables:** Server page fetches data → passes plain objects → Client `*-table.tsx` owns all `render` functions.

**Pattern for icons:** Pass `icon="calendar-days"` string → Client Component maps to component via `ICON_MAP`.

### 2. DashboardLayout
Accepts `variant: "user" | "admin" | "venue-owner" | "coach"`. Do NOT pass `items` or `heading` — those are defined inside `DashboardLayout` by variant. Defined in `components/layout/DashboardLayout.tsx`.

### 3. Zod forms
Use `z.string()` for numeric form fields. Convert to `Number()` in the submit handler. Never `z.coerce.number()`.

### 4. Prisma schema
Provider is `mysql`. URL set via `url = env("DATABASE_URL")` in `prisma/schema.prisma`. No `prisma.config.ts` exists. Two env files needed:
- `.env.local` — read by Next.js at runtime
- `.env` — read by Prisma CLI (`prisma migrate`, `prisma generate`)

Both must have `DATABASE_URL=mysql://root@localhost:3306/bandeja`.

### 5. next-auth
- Config: `auth.ts` (root, not inside `app/`)
- Route handler: `app/api/auth/[...nextauth]/route.ts`
- Get session in Server Component: `const session = await auth()`
- Get session in Client Component: `useSession()` from `next-auth/react`
- Sign out: `signOut()` from `next-auth/react` (Client only)

### 6. Route protection
`proxy.ts` (root) handles all route guards. Role checks done there. Do not add route guards inside individual pages.

---

## Env Setup

`.env.local` (Next.js runtime):
```
DATABASE_URL=mysql://root@localhost:3306/bandeja
NEXTAUTH_SECRET=<any random base64 string>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_CLIENT_SECRET=<from Google Cloud Console>
ADMIN_EMAIL=<gmail that becomes admin>
```

`.env` (Prisma CLI):
```
DATABASE_URL=mysql://root@localhost:3306/bandeja
```

---

## How to Get Each Role

- **ADMIN**: Run `npm run db:seed` — the email matching `ADMIN_EMAIL` env var gets ADMIN role.
- **VENUE_OWNER / COACH**: Login as USER → `/dashboard/profile` → register → login as ADMIN → `/admin/approvals` → approve.

---

## Key Files

```
bandeja/
├── auth.ts                         NextAuth v5 config (Google + PrismaAdapter)
├── proxy.ts                        Route protection (Next.js 16 middleware)
├── lib/prisma.ts                   PrismaClient singleton (simple, no adapter)
├── types/next-auth.d.ts            Extends Session with id + role
├── prisma/schema.prisma            MySQL schema, 12 models, 4 roles
├── prisma/seed.ts                  Seeds admin + 3 venues + 3 coaches
├── hooks/useBooking.ts             Booking state machine
├── components/layout/
│   ├── DashboardLayout.tsx         Client, variant-based nav
│   └── DashboardSidebar.tsx        Client, receives NavItem[] from DashboardLayout
├── components/admin/StatsCard.tsx  Client, icon: string → ICON_MAP
├── components/shared/DataTable.tsx Client, generic table
├── app/admin/*/page.tsx            Server: fetch only
├── app/admin/*/*-table.tsx         Client: render logic for admin tables
└── .env / .env.local               Both needed (see above)
```

---

## Pending Work

1. ~~**Time slot blocking**~~ — ✅ Done. `POST /api/bookings` checks TimeSlot conflicts in transaction, blocks slots on create, releases on CANCELLED.
2. **Payment gateway** — dialog UI exists, marks CONFIRMED locally. No Midtrans/Xendit integration.
3. **Image uploads** — venues and coaches use placeholder/Google avatar images only.
4. **Email notifications** — no transactional email on booking confirmation.
5. **Mobile responsive audit** — dashboard sidebars untested on small screens.
6. **Approvals page** — `/admin/approvals` has client component `approvals-client.tsx`; verify approve/reject API calls work end-to-end.

---

## Run Commands

```bash
cd bandeja
npm run dev          # start dev server (Turbopack)
npm run db:migrate   # create tables from schema
npm run db:seed      # seed admin + venues + coaches
npm run db:generate  # regenerate Prisma client after schema change
npm run db:studio    # Prisma Studio GUI
npm run build        # production build
```
