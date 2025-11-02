# Hamlet Social Frontend

A Next.js 15 application that powers the Hamlet civic discovery experience. The app renders a polished social landing page with bilingual support, business discovery tooling, and an accessible, high-contrast browsing mode.

## Getting started

```bash
npm install
npm run dev
```

The development server runs at <http://localhost:3000>. Run a production build with `npm run build` and start the optimized server via `npm run start`.

### Environment variables

Create a `.env.local` file in the project root and define the following variables:

```bash
NEXT_PUBLIC_API_BASE_URL=https://hamlet-unified-complete-2027-production.up.railway.app
NEXT_PUBLIC_BACKUP_API_URL=https://winter-leaf-f532.safaribosafar.workers.dev
# Optional: required for the AI powered journey planner in the City Guide module
NEXT_PUBLIC_GEMINI_API_KEY=your-google-gemini-api-key
```

The Gemini API key is only needed to generate itineraries inside the City Guide. When it is missing the UI remains functional but explains why AI powered journeys are disabled.

## Project structure

```
app/
  layout.tsx        # Global layout, font loading, metadata
  page.tsx          # Client entry point that wires all feature modules together
components/
  AuthModal.tsx
  BusinessDirectory.tsx
  CityGuide.tsx
  ...               # Shared client components
hooks/
  useTranslations.ts # Translation context and helpers (EN, AR, KU)
lib/
  constants.tsx      # Mock data, translations, and static content
  ...
types/
  index.ts           # Shared TypeScript contracts
```

Tailwind CSS is configured through `tailwind.config.ts` and processed locally via PostCSS (`postcss.config.mjs`). Global styles live in `app/globals.css`.

## Key features

- **Translation provider** – a client-side context with persistence that keeps the UI synchronized across English, Arabic, and Kurdish.
- **Governorate-aware discovery** – filtering support that prepares integration with the production APIs exposed at the configured `NEXT_PUBLIC_API_BASE_URL`.
- **Inclusive access tools** – high-contrast mode, contrast checker, and feature filters surface accessible events and services.
- **AI journey planner** – optional integration with Google’s Gemini models for generating travel itineraries.

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Start the Next.js development server |
| `npm run build`| Create an optimized production build |
| `npm run start`| Run the production build locally     |
| `npm run lint` | Execute Next.js lint checks          |

## Deployment notes

The project outputs a standalone build (`next.config.js`) suitable for containerized hosting. Ensure `NEXT_PUBLIC_*` variables are set in the deployment environment so that runtime fetches point at the desired API tier.
