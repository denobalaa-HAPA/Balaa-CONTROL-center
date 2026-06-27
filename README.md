# Balaa CONTROL Center (Dashboard)

Admin dashboard for the Balaa multi-vendor platform. Built with Next.js 15.

## Features
- Vendor management (onboarding, toggling active/inactive)
- Platform-wide analytics and reporting
- Subscription plan management
- Real-time vendor monitoring

## Setup
```bash
npm install
npm run dev   # starts on port 3002
```

## Environment Variables
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL of the Balaa Control Center API |

## Architecture
This dashboard communicates with the [Balaa Control Center API](https://github.com/denobalaa-HAPA/balaa-control-center-API) for all data operations.
