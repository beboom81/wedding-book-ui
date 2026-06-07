# WeddingBook UI (React)

React + TypeScript + Vite port of the wedding-invitation front-end, hosted on
**GitHub Pages** and talking to the C# API (Azure Web App) over JWT / access-key
auth. It replaces the original vanilla-JS multi-page app.

## Stack

- React 19 + TypeScript + Vite
- react-bootstrap + Bootstrap 5 (original CSS reused verbatim under `src/styles`)
- react-router (HashRouter) — `/` guest invitation, `/#/dashboard` admin
- AOS animations, canvas-confetti

## Routes

| Route | Page |
| ----- | ---- |
| `/` | Guest invitation (countdown, gallery, story, gift, RSVP + comments) |
| `/#/dashboard` | Admin dashboard (login, stats, moderation, settings) |

## Authentication (synced with the API)

- **Admin** logs in with email/password on the dashboard and receives a **JWT**,
  stored in `localStorage` and sent as `Authorization: Bearer`.
- **Guests** use the invitation's public **access key** (sent as `x-access-key`)
  to read config and post comments — no login needed for wedding guests.

The shared HTTP client (`src/lib/api.ts`) auto-selects the header: a 3-part JWT
goes as Bearer, anything else as the access key.

## Configure & run locally

```bash
cp .env.example .env.local   # then edit values
npm install
npm run dev
```

Env vars (`.env.local`):

| Var | Description |
| --- | ----------- |
| `VITE_API_URL` | API base url (the C# backend) |
| `VITE_GUEST_KEY` | Public access key from the dashboard (enables comments) |
| `VITE_WEDDING_TIME` | Countdown target, `YYYY-MM-DD HH:mm:ss` |
| `VITE_AUDIO` | Background music path/url (empty disables) |
| `VITE_CONFETTI` | `true`/`false` |
| `VITE_BASE` | Build base path (`/` or `/<repo>/` for project pages) |

The dev API seeds an admin: `admin@weddingbook.local` / `admin12345`. Get the guest
key from the dashboard's *Setting → Access Key*.

## Deploy to GitHub Pages

1. Repo **Settings → Pages → Source: GitHub Actions**.
2. Add repo **Variables**: `VITE_API_URL`, `VITE_GUEST_KEY` (and `VITE_BASE` if it's
   a project page, e.g. `/wedding-book-ui/`).
3. Push to `main` — `.github/workflows/github-pages.yml` builds and publishes.
   It also copies `index.html` to `404.html` so deep links resolve.

> Make sure the API's `Cors__Origins__0` includes your GitHub Pages origin.

## Project layout

```
src/
  config.ts            env-driven config
  lib/                 api client, session (JWT), util, storage, types
  context/             ThemeContext (dark/light)
  hooks/               useCountdown
  components/
    guest/             invitation pieces (modal, floating buttons, copy)
    comment/           full comment system (list, card, form, gif picker)
    admin/             login modal, settings
  pages/               GuestPage, DashboardPage
```
