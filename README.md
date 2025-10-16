# Hamlet – Social Shell & Serious Experience Embed

This project now hosts the **social experience** and, under the "Serious" tab, embeds the full civic application copied from `hamlat-forntend-6-10/`. The serious view loads inside the social shell via `components/serious/SeriousExperience.tsx`, preserving the civic branding while sharing the same API client and schema contracts.

## Project Structure

The application is a modern, single-page application built with React and TypeScript, styled with Tailwind CSS. It operates without a traditional build tool like Vite or Create React App, using ES modules directly in the browser via an `importmap`.

```
/
├── components/
│   ├── icons/
│   │   └── Icons.tsx         # SVG icons as React components
│   ├── views/
│   │   ├── compose/
│   │   │   ├── EventComposer.tsx # UI for creating events
│   │   │   └── ReelComposer.tsx  # UI for creating reels
│   │   ├── CandidatesView.tsx  # View for listing candidates
│   │   ├── CandidateProfileView.tsx # Detailed view for a single candidate
│   │   ├── ComposeView.tsx     # Main post composer UI
│   │   ├── DebatesView.tsx     # View for listing debates
│   │   ├── ...and other views...
│   ├── BottomBar.tsx         # Mobile navigation
│   ├── CandidatePill.tsx     # Compact candidate display component
│   ├── Header.tsx            # Main application header
│   ├── HeroSection.tsx       # Image carousel on the home page
│   ├── LanguageSwitcher.tsx  # UI for changing language
│   ├── LoginModal.tsx        # Login/Registration modal
│   ├── PostCard.tsx          # Component for displaying a single post
│   ├── Sidebar.tsx           # Desktop sidebar navigation
│   ├── Stories.tsx           # Horizontal stories component
│   └── TopNavBar.tsx         # Reusable tab navigation
├── services/
│   └── geminiService.ts      # Service for interacting with the Google Gemini API
├── App.tsx                   # Main application component, manages state and views
├── constants.ts              # Mock data for users, posts, etc.
├── index.html                # The single HTML entry point
├── index.tsx                 # Renders the React application
├── translations.ts           # Contains all UI text for EN, KU, AR
└── types.ts                  # TypeScript type definitions
```

## Key Files & Features

-   **`App.tsx`**: The core of the application. It manages all major state, including the current user, active view, selected language, and modal visibility. This is the central hub for application logic.
-   **`components/views/HomeView.tsx`**: The main dashboard that users see. It aggregates multiple components like the `HeroSection`, `Stories`, and the main content feed, which is tabbed to show Posts, Reels, Events, etc.
-   **`constants.ts`**: Currently, all data is mocked and stored here. This file is the primary target for replacement when integrating a backend.
-   **`translations.ts`**: A simple but effective internationalization (i18n) solution. All display text is pulled from this file based on the selected language.
-   **Guest Mode & Login Flow**: The app starts in a "guest" mode where content is viewable. Interactions (liking, commenting, viewing reels) are intercepted by the `requestLogin` function, which opens the `LoginModal` to encourage sign-ups.


## Serious Experience Integration

- `components/views/SeriousnessView.tsx` now wraps the full civic app by rendering `components/serious/SeriousExperience.tsx`.
- The civic modules (pages, hooks, services) live under `components/serious/` and reuse the shared API client via `components/serious/services/apiClient.ts`.
- Language direction and styling remain scoped within the memory router, so switching to the Serious tab leaves the social UI unchanged while presenting the civic design.

## Environment & API Client Setup

- **Environment variables**: Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend (default `http://localhost:4001/api` since the dev server now runs on port `4001`). Toggle real vs mock data by setting `VITE_USE_MOCKS=false`.
- **API client**: Social and serious modules both rely on `services/apiClient.ts::apiRequest()`. It attempts real HTTP calls first and falls back to civic mock generators (`components/serious/services/api.ts`) when mocks are enabled or requests fail.
- **Shared schema**: Types are imported from `../shared-schema/types.ts` via `types.ts` to keep both experiences aligned with backend contracts.
