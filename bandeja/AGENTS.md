# BANDEJA — Agent Instructions

You are working on a Next.js 16 padel booking platform. This file overrides any general Next.js knowledge from training data. Read every section before writing code.

---

## Version Breaks — Training Data Is Wrong Here

### Next.js 16
- **`middleware.ts` is deprecated** → use `proxy.ts` (already exists at root)
- **Turbopack is default** in `next dev` — do not add webpack config
- **Server/Client component boundary is strict** — React component instances and functions cannot cross Server→Client as props

### Prisma 6.19.3
- `url = env("DATABASE_URL")` lives **in `prisma/schema.prisma`** (Prisma 6 standard)
- No `prisma.config.ts` — deleted, do not recreate
- `lib/prisma.ts` uses `new PrismaClient()` — no adapter, no constructor args
- Provider is **mysql** (XAMPP MariaDB)
- Two env files required: `.env` for Prisma CLI, `.env.local` for Next.js runtime

### next-auth v5 (Auth.js v5)
- Import from `@/auth`: `import { auth, signIn, signOut } from "@/auth"`
- Session in Server Component: `const session = await auth()`
- Session in Client Component: `useSession()` from `next-auth/react`
- Sign out in Client: `signOut()` from `next-auth/react`

### Zod v4 + react-hook-form v7
- `z.coerce.number()` produces `unknown` input type — breaks resolver types
- **Always** use `z.string()` for numeric form fields
- Convert to number manually in submit: `Number(data.fieldName)`

---

## Forbidden Patterns

```tsx
// NEVER — function/component prop Server→Client
const cols = [{ render: (row) => <Badge>{row.status}</Badge> }]
return <DataTable columns={cols} />  // DataTable is "use client"

// NEVER — Lucide icon component as prop Server→Client
return <StatsCard icon={CalendarDays} />

// NEVER — navItems with icons from Server layout
const navItems = [{ icon: LayoutDashboard, ... }]
return <DashboardLayout items={navItems} />

// NEVER — z.coerce.number() in form schemas
const schema = z.object({ price: z.coerce.number() })
```

---

## Required Patterns

### Tables (Server page + Client table)
Server page: fetch data, pass plain objects. Client `*-table.tsx`: owns all columns + render functions.

```tsx
// app/admin/users/page.tsx (Server Component)
import { UsersTable } from "./users-table";
export default async function Page() {
  const users = await prisma.user.findMany(...);
  return <UsersTable users={users} />;
}

// app/admin/users/users-table.tsx ("use client")
"use client";
const columns = [{ key: "name", header: "User", render: (u) => <div>{u.name}</div> }];
export function UsersTable({ users }) {
  return <DataTable columns={columns} data={users} keyExtractor={(u) => u.id} />;
}
```

### Icons passed to Client Components
```tsx
// Pass string key, Client maps to component
<StatsCard icon="calendar-days" />

// Keys in StatsCard ICON_MAP:
// "calendar-days" | "building" | "users" | "trending-up" | "trophy" | "swords" | "check-circle"
```

### Dashboard layouts
```tsx
// variant prop only — nav items + heading defined inside DashboardLayout
<DashboardLayout variant="admin" userName={...} userEmail={...} userImage={...}>
// Variants: "user" | "admin" | "venue-owner" | "coach"
```

### Numeric form fields
```tsx
const schema = z.object({ price: z.string().min(1) });
// In onSubmit:
await fetch("/api/...", { body: JSON.stringify({ price: Number(data.price) }) });
```

---

## Project Structure

```
bandeja/
├── app/
│   ├── api/                  API routes (all Server)
│   ├── admin/
│   │   ├── */page.tsx        Server: fetch only
│   │   └── */*-table.tsx     Client: render logic
│   ├── dashboard/            User dashboard
│   ├── venue-owner/          Venue owner dashboard
│   ├── coach-dashboard/      Coach dashboard
│   ├── venues/               Public pages
│   ├── coaches/
│   └── matchmaking/
├── auth.ts                   NextAuth config (root)
├── proxy.ts                  Route protection (root)
├── lib/prisma.ts             PrismaClient singleton
├── components/
│   ├── layout/               DashboardLayout, DashboardSidebar, Navbar
│   ├── admin/                StatsCard, ApprovalCard
│   ├── booking/              BookingDialog
│   ├── auth/                 UserDropdown, LoginButton
│   └── shared/               DataTable, StatusBadge
├── hooks/useBooking.ts       Booking state machine
├── prisma/schema.prisma      MySQL schema (12 models)
├── prisma/seed.ts            Seed data
└── types/next-auth.d.ts      Session type (id + role)
```

---

## Role System

| Role | Dashboard | How obtained |
|------|-----------|-------------|
| USER | `/dashboard` | Default on first Google login |
| VENUE_OWNER | `/venue-owner` | Profile form → admin approves |
| COACH | `/coach-dashboard` | Profile form → admin approves |
| ADMIN | `/admin` | `npm run db:seed` sets ADMIN_EMAIL to ADMIN |

Route guards: `proxy.ts` only. Do not add guards inside pages.

---

## What Is NOT Done (do not assume it works)

- Payment gateway (UI only, no Midtrans/Xendit)
- Image uploads (placeholder only)
- Email notifications
- ~~Time slot blocking~~ (DONE — `lib/booking-utils.ts` + `POST /api/bookings` + venue-owner PATCH cancel)
