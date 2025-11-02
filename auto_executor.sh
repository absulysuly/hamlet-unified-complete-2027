#!/bin/bash

################################################################################
# Hamlet Unified Deployment Orchestration System
# Auto Executor Script (Linux/Mac)
################################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="https://hamlet-unified-complete-2027-production.up.railway.app"
FRONTEND_URL="https://iraq-election.vercel.app"
LOG_FILE="deployment_progress.log"
STATUS_FILE="deployment_status.json"

################################################################################
# Functions
################################################################################

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✅ $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}❌ $1${NC}" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}" | tee -a "$LOG_FILE"
}

info() {
    echo -e "${BLUE}ℹ️  $1${NC}" | tee -a "$LOG_FILE"
}

separator() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
}

################################################################################
# Backend Verification (Claude Code Role)
################################################################################

verify_backend_health() {
    log "AGENT: Claude Code (Backend)"
    log "TASK: Verifying backend health check..."

    # Try to reach health endpoint
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/health" || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        success "Backend health check PASSED (HTTP $HTTP_CODE)"
        RESPONSE=$(curl -s "${BACKEND_URL}/health")
        log "Response: $RESPONSE"
        return 0
    else
        error "Backend health check FAILED (HTTP $HTTP_CODE)"
        warning "Backend may still be deploying on Railway..."
        return 1
    fi
}

verify_backend_endpoints() {
    log "TASK: Verifying API endpoints..."

    # Test /api/candidates
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/candidates" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        success "/api/candidates endpoint PASSED"
    else
        error "/api/candidates endpoint FAILED (HTTP $HTTP_CODE)"
    fi

    # Test /api/governorates
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/api/governorates" || echo "000")
    if [ "$HTTP_CODE" = "200" ]; then
        success "/api/governorates endpoint PASSED"
    else
        error "/api/governorates endpoint FAILED (HTTP $HTTP_CODE)"
    fi
}

################################################################################
# Frontend Verification (Cursor Team Role)
################################################################################

verify_frontend() {
    log "AGENT: Cursor Team (Frontend)"
    log "TASK: Verifying frontend deployment..."

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${FRONTEND_URL}" || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
        success "Frontend deployment PASSED (HTTP $HTTP_CODE)"
        return 0
    else
        warning "Frontend not accessible yet (HTTP $HTTP_CODE)"
        return 1
    fi
}

################################################################################
# Status Report
################################################################################

generate_status_report() {
    separator
    log "📊 DEPLOYMENT STATUS REPORT"
    separator

    cat > "$STATUS_FILE" << EOF
{
  "timestamp": "$(date -Iseconds)",
  "phase": "PHASE_1_INITIAL_DEPLOYMENT",
  "agents": {
    "claude_code_backend": {
      "status": "$BACKEND_STATUS",
      "health_check": "$BACKEND_HEALTH",
      "url": "$BACKEND_URL"
    },
    "cursor_team_frontend": {
      "status": "$FRONTEND_STATUS",
      "url": "$FRONTEND_URL"
    },
    "gemini_ai_ux": {
      "status": "PENDING",
      "depends_on": "frontend_deployment"
    }
  },
  "next_steps": [
    "Complete Railway dashboard setup (PostgreSQL + env vars)",
    "Frontend team: Build and deploy to Vercel",
    "UX audit after frontend is live"
  ]
}
EOF

    cat "$STATUS_FILE" | jq '.' 2>/dev/null || cat "$STATUS_FILE"
}

################################################################################
# Main Execution
################################################################################

main() {
    clear
    separator
    echo -e "${GREEN}🚀 HAMLET UNIFIED DEPLOYMENT ORCHESTRATION SYSTEM${NC}"
    separator
    log "Starting deployment verification..."
    echo ""

    # Initialize status variables
    BACKEND_STATUS="UNKNOWN"
    BACKEND_HEALTH="UNKNOWN"
    FRONTEND_STATUS="UNKNOWN"

    # Backend Verification
    separator
    if verify_backend_health; then
        BACKEND_STATUS="DEPLOYED"
        BACKEND_HEALTH="HEALTHY"
        verify_backend_endpoints
    else
        BACKEND_STATUS="DEPLOYING"
        BACKEND_HEALTH="UNKNOWN"
        warning "Backend deployment in progress or not yet started"
        info "Please complete Railway dashboard setup:"
        info "  1. Add PostgreSQL database"
        info "  2. Configure environment variables"
        info "  3. Redeploy if needed"
    fi
    echo ""

    # Frontend Verification
    separator
    if verify_frontend; then
        FRONTEND_STATUS="DEPLOYED"
    else
        FRONTEND_STATUS="PENDING"
        warning "Frontend deployment pending"
        info "Cursor Team: Please build and deploy frontend to Vercel"
    fi
    echo ""

    # Generate Report
    generate_status_report

    separator
    log "✅ Verification complete! Check deployment_status.json for details"
    separator

    # Next Steps
    echo ""
    info "📋 NEXT STEPS:"
    if [ "$BACKEND_HEALTH" != "HEALTHY" ]; then
        echo "   1. ⏳ Complete Railway backend setup (see RAILWAY_DEPLOYMENT.md)"
    fi
    if [ "$FRONTEND_STATUS" != "DEPLOYED" ]; then
        echo "   2. ⏳ Deploy frontend to Vercel"
    fi
    if [ "$BACKEND_HEALTH" = "HEALTHY" ] && [ "$FRONTEND_STATUS" = "DEPLOYED" ]; then
        echo "   ✅ Ready for UX audit!"
    fi
}

# Run main function
main
