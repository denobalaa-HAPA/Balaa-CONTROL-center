# Balaa Control Dashboard

Master dashboard for the Balaa multi-vendor platform. Built with Next.js 15.

The dashboard is a client of the shared Balaa API. It never connects directly to Supabase, storage, vendor repositories, or cache providers.

## Features

- Vendor management and vendor detail views.
- Vendor onboarding/profile updates.
- Active/inactive soft suspension controls.
- Ad visibility/source controls.
- Platform analytics report view.
- API connection failure handling.

## Setup

```bash
npm install
npm run dev
```

The dev server starts on `http://localhost:3002`.

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Shared Balaa API base URL. | `http://localhost:3001` |

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dashboard on port `3002`. |
| `npm run build` | Build for production. |
| `npm start` | Start the production server. |
| `npm run lint` | Run Next linting, when configured. |

## API Boundary

Dashboard requests are centralized in `src/lib/api-client.ts`.

Current API calls:

- `GET /api/vendors`
- `GET /api/vendors/:id`
- `PUT /api/vendors/:id`
- `PATCH /api/vendors/v1/admin/shops/:slug`
- `GET /api/analytics/report`
