# Backpack — Field-to-Finance Prototype

> KTP Associate Task · J McCann & Co Ltd · Deliverable 4
> A mobile-first prototype enabling on-site operatives to log job activity, with real-time cost calculation feeding the Quantity Surveying team.

---

## What this is

A clickable React prototype of the **Backpack** operative app. The user signs in, picks a job, logs time on-site, selects plant/tools/materials/vehicles, and submits — with the cost engine computing the total against a versioned rate card in real time.

On desktop the app renders inside an iPhone-style device frame, so the panel can experience the mobile UX without installing anything. On real mobile devices the frame collapses and the app runs fullscreen.

**Live flow:** Sign In → Today's Jobs → Job Entry → Submitted Receipt

---

## Tech stack

| Layer            | Choice                          | Why                                                                |
| ---------------- | ------------------------------- | ------------------------------------------------------------------ |
| Framework        | React 19 + TypeScript           | Mainstream, easy to deploy, fast iteration                         |
| Build            | Vite                            | Sub-second HMR, ~80KB gzipped production bundle                    |
| Routing          | React Router 7                  | URL-driven navigation, route guards                                |
| State            | Zustand                         | Minimal boilerplate, ergonomic selectors                           |
| Data             | Static JSON via repository interfaces | No backend dependency; Firebase swap-in is a single-file change |
| Tests            | Vitest                          | 12 unit tests on the cost engine; ≥60% coverage on domain (NFR-10) |
| Hosting          | Firebase Hosting                | Static deploy, global CDN, free tier                               |

---

## Architecture

The codebase is layered so each ring depends only on the rings inside it:

```
src/
├── domain/                    # Pure entities + business rules
│   ├── entities.ts            # Job, PlantItem, JobEntryDraft, CostBreakdown, …
│   ├── costEngine.ts          # calculateCost(), hoursBetween(), formatGBP()
│   └── costEngine.test.ts     # 12 unit tests covering FR-CC-01..06
│
├── data/                      # Data sources behind repository interfaces
│   ├── json/                  # plant.json, materials.json, vehicles.json, jobs.json
│   └── repositories/
│       ├── types.ts           # JobsRepository, CatalogRepository, OperativeRepository
│       └── jsonRepos.ts       # JSON-backed implementations (swap for Firestore later)
│
├── application/               # State + use cases (composition of domain + data)
│   ├── stores/                # Zustand stores: authStore, catalogStore, jobsStore
│   └── usecases/
│       └── useCurrentCost.ts  # Derives live CostBreakdown from store state
│
├── presentation/              # React screens + components (UI only)
│   ├── screens/               # SignIn, Home, JobEntry, Submitted
│   ├── components/
│   │   ├── device/            # DeviceFrame — the iPhone shell
│   │   ├── ui/                # Icons
│   │   └── RequireAuth.tsx
│
├── shared/styles/
│   └── tokens.css             # CSS variables — fonts, colors, shadows
│
├── App.tsx                    # Router
└── main.tsx                   # Entry point
```

### Why these boundaries

- **Domain has no React, no Zustand, no Firebase.** Plain TypeScript, fully unit-tested in isolation.
- **Repository interfaces** mean swapping JSON → Firestore is a single-file change (`jsonRepos.ts` → `firebaseRepos.ts`). No store, no component, no test needs to change.
- **Use cases** (`useCurrentCost`) compose stores + domain so screens stay declarative.
- **Screens** only read from stores and render — no business logic.

---


## Running locally

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # run the cost-engine test suite
npm run build      # production build → dist/
npm run preview    # preview the production build
```

---

## Deploying to Firebase Hosting

```bash
# One-time
npm install -g firebase-tools
firebase login

# Every deploy
npm run build
firebase deploy --only hosting
```

`firebase.json` and `.firebaserc` are committed with sensible defaults — the SPA rewrite rule sends all routes back to `index.html` so React Router controls navigation.

---