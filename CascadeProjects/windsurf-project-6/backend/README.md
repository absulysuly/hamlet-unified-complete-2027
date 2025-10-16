# API & Backend Services

## Current Status (70% complete)

### Completed
- GET /women-candidates endpoint
- Authentication flow skeleton
- Database schema v1.0
- Swagger API documentation

### In Progress
- Social tracking endpoints
- Performance testing
- API documentation completion

## API Documentation

Access the interactive API documentation at `/api-docs` when the server is running.

### Available Endpoints

- `GET /api/candidates` - List all candidates
- `GET /api/candidates/women` - List women candidates
- `GET /api/analytics/gender-distribution` - Get gender distribution stats

## Development Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Update the .env file with your configuration
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Testing

- Run unit tests: `npm test`
- Run integration tests: `npm run test:integration`
- Run performance tests: `npm run test:performance`

## Dependencies

- Node.js 16+
- Express.js
- MongoDB
- JWT for authentication

## Blockers
- Final data schema from Agent 2
- Frontend contract changes review needed
- Performance testing pending with full dataset
