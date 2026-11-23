# NESTORA — Your Community. Everything Connected.

Interactive frontend prototype of NESTORA, a residential community operating system for Pakistan. The demo is set in Karachi with Ahmed, apartment A-1204, as the sample resident.

Everything runs in the browser on mock data. There is no backend, and no real payments, access control or hardware are operated.

## Two themes

| Theme | What it shows |
| --- | --- |
| **NESTORA** (default) | The general product: forest green and lime, set in Ocean Heights, DHA Phase VIII |
| **Emaar edition** | A co-branded pitch edition for Emaar Pakistan: Arabian Sea navy and champagne sand, set in Panorama at Emaar Oceanfront |

There are three ways to switch themes:
- the toggle on the demo home page;
- the **Demo as…** menu on any screen;
- a link with `?theme=emaar` or `?theme=nestora`, for example `/resident?theme=emaar`.

The choice is remembered in the browser.

## Roles

| Role | Route |
| --- | --- |
| Resident app | `/resident` |
| Management portal | `/admin` |
| Treasurer | `/admin/billing` |
| Security guard | `/guard` |
| Supervisor | `/supervisor` |
| Service provider | `/provider` |
| Courier | `/courier` |
| Local business | `/business` |
| Locker touchscreen | `/locker` |

All roles share live demo state, kept in `localStorage` and synced across tabs. To see the visitor approval flow happen live, open the resident app and the guard app in two tabs. Use **Demo as… → Reset demo data** to start over.

## Run locally

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
```

## Tech stack

- Next.js 15 (App Router), React 19 and TypeScript
- Tailwind CSS v4, with shadcn-style components built on Radix
- zustand, recharts, react-leaflet, lucide-react and sonner

To deploy on Vercel, import the repository. No settings or environment variables are needed.
