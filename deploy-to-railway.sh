#!/bin/bash

echo "🚀 Deploying Hamlet Backend to Railway..."
echo ""

# Your Railway info
SERVICE_ID="6d10ac65-2961-4237-92cb-02aeca7c324d"
PROJECT_ID="hamlet-unified-complete-2027"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Checking Railway CLI...${NC}"
if ! command -v railway &> /dev/null; then
    echo -e "${RED}Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Railway CLI${NC}"
        echo "Install manually: npm install -g @railway/cli"
        exit 1
    fi
fi

echo -e "${GREEN}✅ Railway CLI ready${NC}"
echo ""

echo -e "${YELLOW}Step 2: Navigating to project directory...${NC}"
cd "$(dirname "$0")"
pwd

echo -e "${GREEN}✅ In project directory${NC}"
echo ""

echo -e "${YELLOW}Step 3: Linking to Railway project...${NC}"
railway link $PROJECT_ID
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to link project${NC}"
    echo "Run manually: railway link"
    exit 1
fi

echo -e "${GREEN}✅ Project linked${NC}"
echo ""

echo -e "${YELLOW}Step 4: Deploying to Railway...${NC}"
railway up
if [ $? -ne 0 ]; then
    echo -e "${RED}Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Deployment triggered!${NC}"
echo ""

echo -e "${YELLOW}Step 5: Testing backend...${NC}"
sleep 10
echo "Testing: https://hamlet-unified-complete-2027-production.up.railway.app/health"

RESPONSE=$(curl -s https://hamlet-unified-complete-2027-production.up.railway.app/health)
if echo "$RESPONSE" | grep -q "OK"; then
    echo -e "${GREEN}✅ BACKEND IS LIVE!${NC}"
    echo "$RESPONSE"
else
    echo -e "${RED}Backend not responding yet. Check Railway dashboard.${NC}"
    echo "Response: $RESPONSE"
fi

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Verify backend: https://hamlet-unified-complete-2027-production.up.railway.app/health"
echo "2. Test API: https://hamlet-unified-complete-2027-production.up.railway.app/api/candidates"
echo "3. Deploy frontend to Cloudflare Pages"
