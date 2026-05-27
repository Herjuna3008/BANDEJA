# BANDEJA — Setup Guide

## Prerequisites

- Node.js 20+
- PostgreSQL database (local or cloud e.g. Supabase, Neon, Railway)
- Google Cloud Console project (for OAuth)

---

## 1. Clone & Install Dependencies

```bash
cd bandeja
npm install
```

---

## 2. Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
# PostgreSQL connection string
DATABASE_URL=postgresql://user:password@localhost:5432/bandeja

# NextAuth secret — generate with: openssl rand -base64 32
NEXTAUTH_SECRET=your-generated-secret

# Public URL of your app
NEXTAUTH_URL=http://localhost:3000

# Google OAuth credentials (see step 3)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email address that gets ADMIN role automatically on first login
ADMIN_EMAIL=your-email@gmail.com
```

---

## 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or use existing)
3. Navigate to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client IDs**
5. Application type: **Web application**
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy the **Client ID** and **Client Secret** to `.env.local`

---

## 4. Database Setup

### Option A: Create local PostgreSQL database

```bash
createdb bandeja
```

### Option B: Use Supabase / Neon / Railway

Create a database and copy the connection string to `DATABASE_URL`.

### Run migrations

```bash
npm run db:migrate
```

When prompted, name the migration (e.g. `init`).

### Seed initial data

```bash
npm run db:seed
```

This creates:
- 1 admin user (using `ADMIN_EMAIL` from env)
- 3 approved venues with courts
- 3 approved coaches with venue associations

---

## 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 6. First Login as Admin

1. Login with the Google account matching `ADMIN_EMAIL`
2. You'll be redirected to `/dashboard`
3. The seed script has already set this email's role to `ADMIN`
4. Navigate to `/admin` to access the admin panel

> **Note:** If you log in before running the seed, your user will be created with `USER` role. Run the seed after login to upgrade to `ADMIN`.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Regenerate Prisma client after schema changes |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema changes without migration files |
| `npm run db:seed` | Seed the database with initial data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

---

## Role System

| Role | Access | How to get |
|------|--------|------------|
| `USER` | Dashboard, booking, matchmaking | Default on first login |
| `VENUE_OWNER` | Venue owner dashboard | Register via `/dashboard/profile` → Admin approves |
| `COACH` | Coach dashboard | Register via `/dashboard/profile` → Admin approves |
| `ADMIN` | Admin panel | Set via seed or manually in DB |

---

## Project Structure

```
bandeja/
├── app/                    # Next.js App Router pages
│   ├── api/                # API route handlers
│   ├── admin/              # Admin dashboard
│   ├── coach-dashboard/    # Coach dashboard
│   ├── dashboard/          # User dashboard
│   ├── venue-owner/        # Venue owner dashboard
│   ├── venues/             # Venue listing & detail
│   ├── coaches/            # Coach listing & detail
│   ├── matchmaking/        # Matchmaking page
│   └── login/              # Login page
├── components/             # React components
├── lib/                    # Utilities (prisma, utils, validations)
├── prisma/                 # Database schema & seed
│   ├── schema.prisma
│   └── seed.ts
├── auth.ts                 # NextAuth.js configuration
├── middleware.ts            # Route protection
└── prisma.config.ts        # Prisma 7 configuration
```
