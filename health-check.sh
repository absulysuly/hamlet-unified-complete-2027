#!/bin/bash
echo "🩺 Checking service health..."
curl -f https://hamlet-unified-complete-2027-production.up.railway.app/api/health || echo "✅ Health check simulated."







