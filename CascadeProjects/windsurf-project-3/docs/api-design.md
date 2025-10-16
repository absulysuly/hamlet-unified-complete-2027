# Tea House Backend API & Real-Time Architecture

## Overview
The backend provides RESTful endpoints for social features, authentication, and story sharing, alongside a Socket.IO real-time layer for chat and notifications. MongoDB stores persistent data using Mongoose schemas.

## Authentication & Authorization
- JWT access tokens (15 min) issued on login/register.
- Refresh tokens (7 days) stored in HTTP-only cookies.
- `Authorization: Bearer <token>` header required for protected endpoints.
- Optional role-based guards (`voter`, `candidate`, `admin`).

## REST API Endpoints

### Auth
- **POST** `/api/auth/register`
  - Body: `{ email, password, name: { ar, en, ku }, role, language }`
  - Creates user, returns tokens.
- **POST** `/api/auth/login`
  - Body: `{ email, password }`
  - Returns tokens + profile summary.
- **GET** `/api/auth/verify`
  - Validates current JWT and returns user payload.
- **POST** `/api/auth/refresh`
  - Requires refresh token cookie; issues new access token.

### Posts
- **GET** `/api/posts`
  - Query params: `authorId`, `type`, `language`, pagination (`page`, `limit`).
- **POST** `/api/posts`
  - Body: `{ content, media?, type, language }`.
- **GET** `/api/posts/:id`
  - Returns single post with comments + author info.
- **PUT** `/api/posts/:id/like`
  - Toggles like for current user.
- **POST** `/api/posts/:id/comments`
  - Body: `{ text }`.

### Stories
- **GET** `/api/stories`
  - Returns active stories grouped by candidate.
- **POST** `/api/stories`
  - Body: `{ mediaUrl, type, duration }` (uploads handled separately via Cloudinary signature endpoint).
- **GET** `/api/stories/:candidateId`
  - Returns latest stories for given candidate.

### Candidates
- **GET** `/api/candidates`
  - Supports pagination & filters.
- **GET** `/api/candidates/:id`
  - Returns profile, posts/stories summary.
- **GET** `/api/candidates/search`
  - Query: `q=<string>` for partial name match.

### Notifications
- **GET** `/api/notifications`
  - Returns unread + recent notifications.
- **PATCH** `/api/notifications/:id/read`
  - Marks notification as read.
- **PATCH** `/api/notification-preferences`
  - Update user notification settings.

## WebSocket Events (namespace `/tea-house`)

### Connection Lifecycle
- `connect`
- `disconnect`

### Room & Messaging
- `join_room` → payload `{ roomId }`
- `leave_room` → payload `{ roomId }`
- `send_message` → payload `{ roomId, text, media?, replyTo? }`
- Server emits `message:new` `{ roomId, message }`
- `typing_start` / `typing_stop` → payload `{ roomId }`

### Presence & Notifications
- Server emits `user:online` / `user:offline` `{ userId }`
- `subscribe_notifications` → payload `{ userId }`
- Server emits `notification:new` `{ notification }`

## MongoDB Collections (Mongoose)

### `User`
```
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  name: { ar: String, en: String, ku: String },
  role: { type: String, enum: ['voter','candidate','admin'], default: 'voter' },
  profileImage: String,
  language: { type: String, enum: ['ar','en','ku'], default: 'ar' },
  createdAt: Date,
  updatedAt: Date
}
```

### `Post`
```
{
  _id: ObjectId,
  authorId: ObjectId,
  content: String,
  media: [String],
  type: { type: String, enum: ['text','image','video','voice'], default: 'text' },
  language: String,
  likes: [ObjectId],
  comments: [{
    _id: ObjectId,
    userId: ObjectId,
    text: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### `TeaHouseRoom`
```
{
  _id: ObjectId,
  name: { ar: String, en: String, ku: String },
  description: { ar: String, en: String, ku: String },
  participants: [ObjectId],
  messages: [{
    _id: ObjectId,
    userId: ObjectId,
    text: String,
    media: [String],
    timestamp: Date
  }],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### `Story`
```
{
  _id: ObjectId,
  candidateId: ObjectId,
  mediaUrl: String,
  type: { type: String, enum: ['image','video'] },
  duration: Number,
  views: [ObjectId],
  expiresAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### `Notification`
```
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,
  data: Object,
  isRead: Boolean,
  createdAt: Date
}
```

### `NotificationPreference`
```
{
  _id: ObjectId,
  userId: ObjectId,
  preferences: {
    push: Boolean,
    email: Boolean,
    sms: Boolean
  },
  updatedAt: Date
}
```

## Non-Functional Considerations
- Pagination default `limit=20`, max `100`.
- Validation via `Joi` schemas for bodies and params.
- Error handling middleware returns `{ message, details }`.
- Rate limiting on auth endpoints (5 req/min/IP).
- Logging with `morgan` (HTTP) and Socket.IO middleware (connect/disconnect).

## Immediate Implementation Tasks
1. Initialize Node.js project with Express, Socket.IO, Mongoose.
2. Configure environment loading and Mongo connection handling.
3. Implement JWT auth middleware and user model.
4. Scaffold REST routes/controllers for auth, posts, stories, candidates, notifications.
5. Set up Socket.IO server with rooms, typing indicators, notifications stream.
6. Prepare Docker Compose with MongoDB + Redis for dev.
