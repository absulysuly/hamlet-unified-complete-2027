#!/bin/bash

echo "========================================"
echo " YOUR SITE IS STARTING"
echo "========================================"
echo ""

cd "$(dirname "$0")/out"
sleep 2 && (command -v xdg-open &> /dev/null && xdg-open http://localhost:8080 || open http://localhost:8080) &
python3 -m http.server 8080
