# 🧟 Zombii — Kill the subscriptions draining you

Zombii scans a bank statement, hunts down every recurring charge, silent price
hike and zombie (unused) subscription, scores the leak, and tells you exactly
what to cancel, downgrade, or renegotiate.

Single deploy — frontend + backend live together on **Vercel** (backend runs as
serverless functions in `/api`).

## Structure
```
zombii/
├── api/                 Serverless functions (Vercel)
│   ├── _detector.js     detection engine + embedded demo data
│   ├── demo.js          GET  /api/demo    → analyses the demo statement
│   └── analyze.js       POST /api/analyze → analyses an uploaded CSV
├── src/                 React (Vite) frontend
│   ├── App.jsx
│   ├── api.js
│   └── components/      CountUp, Gauge, Donut, SubCard
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

## Run locally
Use the Vercel CLI so the `/api` routes work exactly like production:
```bash
npm install
npm i -g vercel
vercel dev            # http://localhost:3000
```
Loads the demo statement automatically; drag-drop your own CSV (columns:
`date, description, amount`) to analyse it live.

> Plain `npm run dev` runs the UI but the `/api` calls won't resolve — use
> `vercel dev` for the full app locally.

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. On vercel.com → **New Project** → import the repo.
3. Framework preset: **Vite** (auto-detected). No env vars needed.
4. Deploy → you get one URL that serves the app *and* the `/api` functions.

That URL is your hackathon submission link.
