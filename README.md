# FitnessTouch

**Gym Body Composition Assessment (BCA) Report Management System**

A professional tool for gym trainers to manage member profiles, record BCA assessments, and generate multi-page PDF reports with nutrition plans and progress analysis.

---

## Features

- 👥 **Member Management** — Create and manage member profiles with dietary preferences
- 📊 **BCA Assessments** — Record unlimited assessments per member
- 📈 **Progress Tracking** — Auto-compare each assessment against the previous one
- 📄 **PDF Reports** — 5-page professional PDF: cover, metrics, progress, nutrition, summary
- 🍽️ **Nutrition Engine** — Rule-based meal plans using Harris-Benedict BMR formula
- 🏋️ **Dashboard** — Stats, due-for-reassessment alerts, member growth chart
- 🔐 **Auth** — Supabase email/password auth for trainers

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15 | Framework (App Router) |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 3.x | Styling |
| Prisma | 5.x | Database ORM |
| Supabase | - | PostgreSQL + Auth + Storage |
| @react-pdf/renderer | 3.x | PDF generation (server-side) |
| Recharts | 2.x | Dashboard charts only |
| Zod + React Hook Form | - | Form validation |

---

## Local Development Setup

### 1. Clone and Install

```bash
git clone <your-repo-url> fitnesstouch
cd fitnesstouch
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Settings → Database → Connection Strings**
   - Copy **Transaction pooler** URL (port 6543) → `DATABASE_URL`
   - Copy **Direct** URL (port 5432) → `DIRECT_URL`
3. Go to **Settings → API**
   - Copy Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`
4. Go to **Authentication → Settings**
   - Disable **Email confirmations** (trainer-only system)
5. Go to **Authentication → Users**
   - Create a trainer account manually (Add User button)
6. Go to **Storage**
   - Create a bucket named `gym-logos`
   - Set to **Public**

### 3. Create `.env.local`

```bash
cp .env.example .env.local
```

Fill in all values from the Supabase steps above.

### 4. Run Database Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. (Optional) Seed Sample Data

```bash
npm run db:seed
```

This creates 5 sample members with 2-3 assessments each for immediate testing.

### 6. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## First-Time Setup (After Login)

1. Go to **/settings** → Set your gym name, upload logo, choose brand color
2. Go to **/members** → Create your first member
3. Go to the member profile → Click **+ New Assessment**
4. After saving → Click **View Report** → **Download PDF**

---

## Vercel Deployment

1. Push your repository to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.local` to **Vercel → Settings → Environment Variables**
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel production URL
5. Deploy

> **Note**: Use the **Transaction pooler URL** (port 6543) for `DATABASE_URL` on Vercel (serverless). The `DIRECT_URL` (port 5432) is only needed for `prisma migrate deploy`.

### Deploying Migrations to Production

```bash
npx prisma migrate deploy
```

---

## Project Structure

```
src/
├── app/                     # Next.js App Router pages + API routes
│   ├── api/                 # REST API endpoints
│   ├── dashboard/           # Dashboard page
│   ├── login/               # Login page
│   ├── members/             # Members list, profile, assessment, report pages
│   └── settings/            # Gym settings page
├── components/              # Reusable React components
│   ├── ui/                  # Primitive UI (Button, Input, Select, Badge, Card)
│   ├── layout/              # Sidebar, TopBar, AuthGuard
│   ├── members/             # Member-specific components
│   └── dashboard/           # Dashboard-specific components
├── lib/
│   ├── engines/             # Pure TypeScript logic (no AI)
│   │   ├── comparisonEngine.ts   # Delta calculation + interpretation text
│   │   ├── nutritionEngine.ts    # BMR → TDEE → macros → meal suggestions
│   │   └── healthRanges.ts       # Healthy range constants + getStatus()
│   ├── utils/               # formatters.ts, validators.ts (Zod schemas)
│   ├── prisma.ts            # Prisma client singleton
│   └── supabase.ts          # Browser + server Supabase clients
├── pdf/                     # @react-pdf/renderer components (server-only)
│   ├── pages/               # 5 PDF pages
│   ├── components/          # Reusable PDF components (ComparisonBarChart uses SVG)
│   └── styles/              # StyleSheet.create definitions
├── types/                   # Shared TypeScript interfaces
└── middleware.ts             # Supabase Auth route protection
prisma/
├── schema.prisma            # Database schema
└── seed.ts                  # Sample data seed script
```

---

## PDF Report Structure

| Page | Content |
|------|---------|
| 1 — Cover | Gym logo, member info table, assessment date |
| 2 — Health Metrics | All BCA values with healthy ranges and status badges |
| 3 — Progress | Previous vs current comparison table + custom SVG bar chart |
| 4 — Nutrition | Calorie target, macros, meal suggestions, supplements |
| 5 — Summary | Priority recommendations, next assessment date, gym contact |

> **Note**: Charts in the PDF are custom SVG components built with `@react-pdf/renderer` primitives only — Recharts is used on the web dashboard only.

---

## Engine Logic (No AI)

### Comparison Engine
- Calculates deltas between consecutive assessments
- Generates interpretation text based on rules (e.g., fat↓ + muscle↑ = "Excellent recomposition")
- First assessment: returns `hasComparison: false`, PDF renders "Baseline" banner

### Nutrition Engine
1. **BMR** — Harris-Benedict formula (gender-differentiated)
2. **TDEE** — BMR × activity multiplier (1.375 / 1.55 / 1.725)
3. **Calorie target** — TDEE ± goal adjustment (−400 fat loss / +300 muscle gain)
4. **Macros** — Split by goal (protein/carbs/fat percentages)
5. **Meal suggestions** — Filtered by diet type from curated pool
6. **Supplements** — Only shown when `supplementsAllowed = true`

---

## Environment Variables Reference

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (server-side only) |
| `DATABASE_URL` | Pooler URL (port 6543, for runtime) |
| `DIRECT_URL` | Direct URL (port 5432, for migrations only) |
| `NEXT_PUBLIC_APP_URL` | App URL (for WhatsApp share links) |

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Regenerate Prisma client |

---

Built with ❤️ for gym professionals.
