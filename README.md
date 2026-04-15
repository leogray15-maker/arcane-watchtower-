# 🔮 Arcane Watchtower

> Real-time global intelligence dashboard. Built for the Arcane Archives ecosystem.

Arcane Watchtower is a customised fork of [World Monitor](https://github.com/koala73/worldmonitor) — a powerful open-source OSINT and geopolitical intelligence platform. Rebranded and configured for [arcanearchives.shop](https://arcanearchives.shop).

## Features

- 🌍 Real-time conflict tracking (ACLED, UCDP)
- ✈️ Military ADS-B flight monitoring
- 🚢 Maritime AIS ship tracking
- 📈 XAUUSD & global markets live data
- 🔥 NASA FIRMS satellite fire detection
- ⚡ GPS jamming zone detection
- 🌐 Cyber threat monitoring
- 📰 435+ curated intelligence RSS feeds
- 🤖 AI-powered intelligence synthesis

## Quick Deploy (Vercel)

1. Push this repo to GitHub
2. Import in Vercel
3. Set environment variables (see `.env.example`)
4. Deploy

## Local Dev

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure your keys. At minimum you need:

- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — for data caching
- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` — for AI features

See `.env.example` for the full list.

## Stack

- **Frontend**: TypeScript + Vite
- **Backend**: Vercel API Routes (Node.js)
- **Map**: Protomaps / MapLibre GL
- **Data**: Redis (Upstash), 30+ external APIs
- **Auth**: Clerk (optional, for pro features)

## Credit

Forked from [World Monitor](https://github.com/koala73/worldmonitor) by Elie Habib. Licensed under AGPL-3.0.

---

*Part of the [Arcane](https://arcanearchives.shop) ecosystem — built by [@arcane.leo](https://x.com/arcane_leo)*
