#!/bin/bash

################################################################################
# Cloudflare + Railway Backend Integration Tester
# Tests both primary (Railway) and failover (Cloudflare) endpoints
################################################################################

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🔍 BACKEND INTEGRATION TESTER${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Configuration
RAILWAY_URL="https://hamlet-unified-complete-2027-production.up.railway.app"
CLOUDFLARE_URL=""  # Will be set after Cloudflare Worker deployment

# If Cloudflare Worker URL is provided as argument
if [ -n "$1" ]; then
    CLOUDFLARE_URL="$1"
fi

################################################################################
# Test Functions
################################################################################

test_endpoint() {
    local name=$1
    local url=$2
    local endpoint=$3

    echo -e "${BLUE}Testing: ${name} ${endpoint}${NC}"

    HTTP_CODE=$(curl -s -o /tmp/response.json -w "%{http_code}" "${url}${endpoint}" 2>/dev/null || echo "000")
    RESPONSE=$(cat /tmp/response.json 2>/dev/null || echo "")

    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✅ SUCCESS (HTTP ${HTTP_CODE})${NC}"
        echo -e "   Response: $RESPONSE"
        return 0
    elif [ "$HTTP_CODE" = "403" ]; then
        echo -e "${YELLOW}⚠️  NOT CONFIGURED (HTTP ${HTTP_CODE})${NC}"
        echo -e "   Backend needs configuration (PostgreSQL + env vars)"
        return 1
    elif [ "$HTTP_CODE" = "503" ]; then
        echo -e "${YELLOW}⚠️  SERVICE UNAVAILABLE (HTTP ${HTTP_CODE})${NC}"
        echo -e "   Failover may be active"
        return 1
    else
        echo -e "${RED}❌ FAILED (HTTP ${HTTP_CODE})${NC}"
        echo -e "   Response: $RESPONSE"
        return 1
    fi
}

test_failover() {
    echo -e "${BLUE}Testing: Failover behavior${NC}"

    if [ -z "$CLOUDFLARE_URL" ]; then
        echo -e "${YELLOW}⚠️  Cloudflare Worker URL not configured${NC}"
        echo -e "   Deploy Cloudflare Worker first, then run:"
        echo -e "   ./test-cloudflare-integration.sh <your-worker-url>"
        return 1
    fi

    # Test with Railway down simulation (would need actual test)
    echo -e "${BLUE}Checking for X-Backend-Source header...${NC}"
    HEADERS=$(curl -s -I "${CLOUDFLARE_URL}/health" 2>/dev/null || echo "")

    if echo "$HEADERS" | grep -i "X-Backend-Source" > /dev/null; then
        SOURCE=$(echo "$HEADERS" | grep -i "X-Backend-Source" | cut -d: -f2 | tr -d '[:space:]')
        echo -e "${GREEN}✅ Backend source: ${SOURCE}${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  No backend source header found${NC}"
        return 1
    fi
}

################################################################################
# Main Tests
################################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}1. TESTING RAILWAY BACKEND (Primary)${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

RAILWAY_HEALTH_OK=false
RAILWAY_CANDIDATES_OK=false
RAILWAY_GOVERNORATES_OK=false

if test_endpoint "Railway" "$RAILWAY_URL" "/health"; then
    RAILWAY_HEALTH_OK=true
fi
echo ""

if test_endpoint "Railway" "$RAILWAY_URL" "/api/candidates"; then
    RAILWAY_CANDIDATES_OK=true
fi
echo ""

if test_endpoint "Railway" "$RAILWAY_URL" "/api/governorates"; then
    RAILWAY_GOVERNORATES_OK=true
fi
echo ""

################################################################################
# Cloudflare Tests
################################################################################

if [ -n "$CLOUDFLARE_URL" ]; then
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}2. TESTING CLOUDFLARE GATEWAY (Failover)${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""

    CLOUDFLARE_HEALTH_OK=false
    CLOUDFLARE_CANDIDATES_OK=false
    CLOUDFLARE_GOVERNORATES_OK=false

    if test_endpoint "Cloudflare" "$CLOUDFLARE_URL" "/health"; then
        CLOUDFLARE_HEALTH_OK=true
    fi
    echo ""

    if test_endpoint "Cloudflare" "$CLOUDFLARE_URL" "/api/candidates"; then
        CLOUDFLARE_CANDIDATES_OK=true
    fi
    echo ""

    if test_endpoint "Cloudflare" "$CLOUDFLARE_URL" "/api/governorates"; then
        CLOUDFLARE_GOVERNORATES_OK=true
    fi
    echo ""

    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}3. TESTING FAILOVER BEHAVIOR${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""

    test_failover
    echo ""
else
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}2. CLOUDFLARE GATEWAY${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  Cloudflare Worker not deployed yet${NC}"
    echo -e "   To deploy:"
    echo -e "   1. Install Wrangler: npm install -g wrangler"
    echo -e "   2. Login: wrangler login"
    echo -e "   3. Deploy: wrangler deploy"
    echo -e "   4. Re-run this script with Worker URL"
    echo ""
fi

################################################################################
# Summary Report
################################################################################

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}📊 INTEGRATION TEST SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Railway Summary
echo -e "${BLUE}Railway Backend (Primary):${NC}"
echo -e "  Health:       $([ "$RAILWAY_HEALTH_OK" = true ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL${NC}")"
echo -e "  Candidates:   $([ "$RAILWAY_CANDIDATES_OK" = true ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL${NC}")"
echo -e "  Governorates: $([ "$RAILWAY_GOVERNORATES_OK" = true ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL${NC}")"
echo ""

# Cloudflare Summary
if [ -n "$CLOUDFLARE_URL" ]; then
    echo -e "${BLUE}Cloudflare Gateway (Failover):${NC}"
    echo -e "  Health:       $([ "$CLOUDFLARE_HEALTH_OK" = true ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL${NC}")"
    echo -e "  Candidates:   $([ "$CLOUDFLARE_CANDIDATES_OK" = true ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL${NC}")"
    echo -e "  Governorates: $([ "$CLOUDFLARE_GOVERNORATES_OK" = true ] && echo -e "${GREEN}✅ OK${NC}" || echo -e "${RED}❌ FAIL${NC}")"
else
    echo -e "${BLUE}Cloudflare Gateway (Failover):${NC}"
    echo -e "  Status: ${YELLOW}⏳ Not deployed${NC}"
fi
echo ""

# Overall status
if [ "$RAILWAY_HEALTH_OK" = true ]; then
    echo -e "${GREEN}✅ PRIMARY BACKEND OPERATIONAL${NC}"
elif [ -n "$CLOUDFLARE_URL" ] && [ "$CLOUDFLARE_HEALTH_OK" = true ]; then
    echo -e "${YELLOW}⚠️  RUNNING ON FAILOVER${NC}"
else
    echo -e "${RED}❌ ALL BACKENDS DOWN${NC}"
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"

# Cleanup
rm -f /tmp/response.json
