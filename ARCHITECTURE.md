# BANDEJA — Architecture

---

## High-Level Overview

```
Browser
  │
  ├── Public pages (/, /venues, /coaches, /matchmaking)
  │     → Server Components, no auth required
  │
  ├── Auth flow
  │     /login → Google OAuth → NextAuth callback → DB session created → redirect
  │
  ├── Protected pages (any /dashboard, /admin, /venue-owner, /coach-dashboard)
  │     → proxy.ts intercepts → checks session + role → redirect if unauthorized
  │
  └── Dashboards
        → Server layout (auth check) → Client DashboardLayout (nav + sidebar)
        → Server page (DB fetch) → Client components (interactive UI)
```

---

## Auth Flow

```
User clicks "Masuk"
  → /login page
  → signIn("google") [next-auth/react]
  → Google OAuth consent screen
  → Google redirects to /api/auth/callback/google
  → NextAuth creates/updates User + Account rows in DB
  → Session row created (sessionToken in cookie)
  → Callback: session.user.id + session.user.role injected
  → Redirect to /dashboard (or original URL)

Subsequent requests:
  → proxy.ts reads session via auth()
  → Checks role against route prefix
  → Redirect if unauthorized, else NextResponse.next()
```

**Session strategy:** database (not JWT). Session stored in `Session` table, token in cookie.

**Role check in `proxy.ts`:**

| Route prefix | Required role |
|-------------|---------------|
| `/admin` | ADMIN |
| `/venue-owner` | VENUE_OWNER or ADMIN |
| `/coach-dashboard` | COACH or ADMIN |
| `/dashboard` | any authenticated |
| `/` or `/login` | public |

---

## Database Schema

```
User
  ├── id, name, email, image, role, createdAt
  ├── → Account[] (OAuth accounts)
  ├── → Session[] (active sessions)
  ├── → Booking[] (court bookings made)
  ├── → CoachBooking[] (coach sessions booked)
  ├── → MatchPost[] (matchmaking posts)
  ├── → Venue? (if VENUE_OWNER)
  └── → Coach? (if COACH)

Venue
  ├── id, name, code, shortName, area, district, tone, status(PENDING/APPROVED/REJECTED)
  ├── ownerId → User
  ├── → Court[]
  └── → CoachVenue[]

Court
  ├── id, name, surface(INDOOR/OUTDOOR), status(AVAILABLE/MAINTENANCE)
  ├── pricePerHour (Int, in IDR)
  ├── venueId → Venue
  ├── → Booking[]
  └── → TimeSlot[] (not yet wired to booking logic)

Booking
  ├── id, bookingCode(unique), date, startTime, duration, totalPrice
  ├── paymentMethod, status(PENDING/CONFIRMED/CANCELLED/COMPLETED)
  ├── userId → User
  └── courtId → Court

Coach
  ├── id, specialty, experience, ratePerSession, status, bio
  ├── userId → User (1:1)
  ├── → CoachBooking[]
  └── → CoachVenue[]

CoachBooking
  ├── id, bookingCode, date, time, sessions, totalPrice
  ├── paymentMethod, status
  ├── userId → User
  └── coachId → Coach

CoachVenue (junction)
  ├── coachId → Coach
  └── venueId → Venue

MatchPost
  ├── id, level, venueCourt, date, time, format, isOpen
  └── userId → User

Account, Session, VerificationToken  ← NextAuth managed
TimeSlot  ← exists, not wired to booking conflict checks yet
```

---

## Component Architecture

### Server/Client split

```
layout.tsx (Server)          ← auth() check, redirect if unauthorized
  └── DashboardLayout (Client)  ← useState for mobile sidebar, reads variant → navItems
        └── DashboardSidebar (Client)  ← usePathname for active link highlight

page.tsx (Server)            ← prisma queries, passes plain data down
  └── *-table.tsx (Client)   ← columns with render functions (never in server page)
  └── StatsCard (Client)     ← icon: string → ICON_MAP lookup
  └── *-client.tsx (Client)  ← forms, mutations, interactive state
```

### Key constraint: Server → Client boundary
Only serializable values cross this boundary:
- ✅ strings, numbers, booleans, plain objects, arrays
- ❌ functions, class instances, React components, Lucide icons

**Workarounds used:**
- Icons: pass string key (`"calendar-days"`) → Client maps via `ICON_MAP`
- Render functions: move entire column definition into Client `*-table.tsx`
- Nav items: `DashboardLayout` defines all navItems internally by `variant` prop

---

## API Routes

All under `app/api/`. All are Server Route Handlers (no "use client").

```
/api/auth/[...nextauth]           NextAuth handler (GET + POST)

/api/venues                       GET list, POST create
/api/venues/[id]                  GET detail, PATCH, DELETE

/api/bookings                     GET user's bookings, POST create booking
/api/coach-bookings               GET user's coach bookings, POST create

/api/coaches                      GET list
/api/coaches/[id]                 GET detail

/api/matchmaking                  GET posts, POST create
/api/matchmaking/[id]             DELETE

/api/register/venue-owner         POST (register as venue owner → PENDING)
/api/register/coach               POST (register as coach → PENDING)

/api/venue-owner/courts           GET, POST (venue owner manages courts)
/api/venue-owner/courts/[id]      PATCH, DELETE
/api/venue-owner/bookings         GET bookings for owned venue
/api/venue-owner/bookings/[id]    PATCH status
/api/venue-owner/profile          GET, PATCH venue profile

/api/coach-dashboard/profile      GET, PATCH coach profile
/api/coach-dashboard/bookings     GET coach's bookings
/api/coach-dashboard/clients      GET distinct clients
/api/coach-dashboard/venues       GET associated venues

/api/admin/users                  GET all users, PATCH role
/api/admin/venues                 GET all venues
/api/admin/coaches                GET all coaches
/api/admin/bookings               GET all bookings
/api/admin/stats                  GET aggregate stats
/api/admin/approvals              GET pending approvals
/api/admin/approvals/[id]         POST approve/reject
```

---

## Booking Flow

```
User on /venues/[venueId]
  → Clicks "Book Court Ini"
  → useBooking() hook: openBooking(venue, court)
  → BookingDialog opens (step: "details")

Step 1 — Details:
  → Select date, time slot, duration
  → total = pricePerHour × duration

Step 2 — Payment:
  → Select method (Transfer / QRIS)
  → QRIS shows QR placeholder

Step 3 — Confirm:
  → confirmPayment() → POST /api/bookings
  → API creates Booking row with unique bookingCode
  → Response: { bookingCode }
  → toast.success with booking code
  → Dialog closes
```

**Same flow for coach booking:** `/coaches/[coachId]` → POST `/api/coach-bookings`

---

## Approval Flow (Venue Owner / Coach)

```
User (role: USER)
  → /dashboard/profile
  → Fills registration form
  → POST /api/register/venue-owner  OR  /api/register/coach
  → Creates Venue/Coach record with status: PENDING
  → User sees "pendaftaran dalam proses review" banner

Admin
  → /admin/approvals
  → Sees pending registrations (approvals-client.tsx)
  → Clicks Approve → POST /api/admin/approvals/[id] { action: "approve" }
  → API sets status: APPROVED, updates user.role to VENUE_OWNER/COACH
  → User can now access their dashboard
```

---

## File Naming Conventions

| Pattern | Description |
|---------|-------------|
| `app/*/page.tsx` | Server Component, fetches data |
| `app/*/*-client.tsx` | Client Component, interactive UI for that page |
| `app/*/*-table.tsx` | Client Component, DataTable with render columns |
| `app/*/layout.tsx` | Server Component, auth + role check |
| `components/layout/` | Shared layout primitives (DashboardLayout, Navbar) |
| `components/shared/` | Generic UI (DataTable, StatusBadge) |
| `components/admin/` | Admin-specific components (StatsCard, ApprovalCard) |
| `app/api/*/route.ts` | API Route Handler (always Server) |

---

## Environment Variables

| Variable | Used by | Purpose |
|----------|---------|---------|
| `DATABASE_URL` | Prisma (both CLI + runtime) | MySQL connection string |
| `NEXTAUTH_SECRET` | next-auth | Session encryption key |
| `NEXTAUTH_URL` | next-auth | Canonical app URL |
| `GOOGLE_CLIENT_ID` | next-auth Google provider | OAuth client |
| `GOOGLE_CLIENT_SECRET` | next-auth Google provider | OAuth secret |
| `ADMIN_EMAIL` | `prisma/seed.ts` | Email that gets ADMIN role on seed |

Two files needed: `.env` (Prisma CLI) and `.env.local` (Next.js runtime). Both need `DATABASE_URL`.
