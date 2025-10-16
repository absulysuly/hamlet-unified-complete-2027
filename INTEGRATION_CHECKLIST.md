# Integration Checklist: Mocks to Real Data

Use this checklist when transitioning the frontends from mock data to the live backend.

1. **Configure environment variables**
   - Copy `.env.example` to `.env` in `Copy-of-Hamlet-social/` and `hamlat-forntend-6-10/`.
   - Set `VITE_API_BASE_URL` to the deployed backend (e.g., `https://api.hamlet.dev/api`).
   - Set `VITE_USE_MOCKS=false` to force real network calls.

2. **Verify backend endpoints**
   - Ensure each route in `backend/API_CONTRACT.md` is implemented.
   - Confirm CORS allows the frontend origins.

3. **Run contract tests**
   - Add automated tests (or manual requests) to validate payloads match types from `shared-schema/types.ts`.
   - Check authentication flows (login, secured POSTs) return expected tokens/responses.

4. **Frontends sanity check**
   - Start both frontends: `npm run dev` in `Copy-of-Hamlet-social/` and `hamlat-forntend-6-10/`.
   - Navigate key flows:
     - Social feed (posts, reels, events, debates).
     - Civic dashboards (stats, participation, governorate pages).
     - Integrity report submission.
   - Confirm loading and error states behave; adjust `apiClient.ts` logging if needed.

5. **Fallback strategy**
   - Keep `VITE_USE_MOCKS=true` as a quick toggle for demos when the backend is unavailable.
   - Monitor logs for `apiRequest` warnings; these indicate a fallback occurred.

6. **Deployment**
   - Update deployment pipelines to inject production `.env` values.
   - Ensure backend and frontends share release notes whenever schema or endpoints change.
