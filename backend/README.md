# Backend Workspace

This directory houses backend specs and, eventually, the implementation that serves both frontends.

## Getting Started

1. Review `API_CONTRACT.md` for the endpoints required by the React frontends.
2. Scaffold your backend (Node/Nest, FastAPI, etc.) inside this folder.
3. Reuse the shared models from `../shared-schema/types.ts` (e.g. via a build step or code generation) to keep contracts aligned.
4. Configure environment variables (`DATABASE_URL`, `GEMINI_API_KEY`, etc.) as needed.

## Development Checklist

- Implement each endpoint from `API_CONTRACT.md` and ensure responses match the shared schema.
- Secure Gemini access by proxying calls server-side; the frontends should never expose API keys.
- Enable CORS for the dev origins serving `Copy-of-Hamlet-social` and `hamlat-forntend-6-10`.
- Add automated tests validating contract compliance before exposing to the frontends.
