# Backend API Contract

These endpoints align with the shared types in `../shared-schema/types.ts` and are consumed by both frontends.

## Authentication

### POST `/auth/login`
- **Body**: `{ "role": "Voter" | "Candidate" }`
- **Response**: `User` object and access token (e.g. `{ user: User, token: string }`).
- **Notes**: Use the `User` type exported from the shared schema.

## Social Surface (`Copy-of-Hamlet-social`)

### GET `/social/users`
- **Query**:
  - `role` *(optional)* — filter by `UserRole`.
  - `governorate` *(optional)* — restrict to a governorate key (`Governorate`).
- **Response**: `User[]`.

### GET `/social/posts`
- **Query**:
  - `type` *(optional)* — `'Post' | 'Reel'`.
  - `governorate` *(optional)* — governorate filter.
  - `authorId` *(optional)* — filter by author.
- **Response**: `Post[]`.

### POST `/social/posts`
- **Body**: `{ content: string }` plus authenticated user context.
- **Response**: Newly created `Post`.

### POST `/social/reels`
- **Body**: `{ caption: string, mediaUrl?: string }`.
- **Response**: Newly created reel as `Post` type `'Reel'`.

### GET `/social/events`
- **Query**: `governorate` *(optional)*.
- **Response**: `Event[]`.

### POST `/social/events`
- **Body**: `{ title: string, date: string, location: string }`.
- **Response**: Newly created `Event`.

### GET `/social/debates`
- **Query**:
  - `governorate` *(optional)*.
  - `participantIds` *(optional)* — comma-separated participant IDs.
- **Response**: `Debate[]`.

### GET `/social/articles`
- **Query**: `governorate` *(optional)*.
- **Response**: `Article[]`.

### POST `/social/follow`
- **Body**: `{ candidateId: string }`.
- **Response**: `{ success: boolean }`.

### POST `/social/like`
- **Body**: `{ postId: string }`.
- **Response**: `{ success: boolean }`.

## Civic Dashboards (`hamlat-forntend-6-10`)

### GET `/civic/stats/dashboard`
- **Response**: `DashboardStats` *(extend shared schema as backend evolves)*.

### GET `/civic/stats/participation`
- **Response**: `GovernorateParticipation[]` (uses local type; consider promoting to shared schema).

### GET `/civic/governorates/:slug`
- **Params**: `slug` = lowercased English governorate name.
- **Response**: `GovernorateData` (uses `Governorate` plus local metadata).

### GET `/civic/parties/:id`
- **Response**: `{ party: Party; candidates: Candidate[] }`.

### POST `/civic/reports/integrity`
- **Body**: `multipart/form-data` containing `governorate`, `violationType`, `description`, optional `evidence` file.
- **Response**: `{ success: boolean; trackingId: string }`.

## Integration Notes
- All responses should serialize using the shared TypeScript definitions where available.
- Authentication tokens should be validated on protected mutations (`/social/*` POST endpoints).
- CORS must allow origins serving both frontends during development.
