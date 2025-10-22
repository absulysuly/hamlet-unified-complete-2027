FROM node:20-slim

WORKDIR /app

ENV NODE_ENV=production \
    PORT=4001

# Install dependencies first for better layer caching
COPY package.json package-lock.json* ./
RUN npm ci

# Prisma client generation before copying rest to leverage cache
COPY prisma ./prisma
RUN npx prisma generate

# Copy remaining source and build the TypeScript project
COPY . .
RUN npm run build

EXPOSE 4001

# Apply pending migrations, seed data, then launch the API
CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npx prisma db seed && node dist/index.js"]
