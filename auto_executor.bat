@echo off
REM ############################################################################
REM Hamlet Unified Deployment Orchestration System
REM Auto Executor Script (Windows)
REM ############################################################################

setlocal enabledelayedexpansion

REM Configuration
set BACKEND_URL=https://hamlet-unified-complete-2027-production.up.railway.app
set FRONTEND_URL=https://iraq-election.vercel.app
set LOG_FILE=deployment_progress.log
set STATUS_FILE=deployment_status.json

REM Clear screen
cls

echo ===============================================================================
echo  HAMLET UNIFIED DEPLOYMENT ORCHESTRATION SYSTEM
echo ===============================================================================
echo.

REM Check for curl
where curl >nul 2>&1
if errorlevel 1 (
    echo ERROR: curl is required but not found in PATH
    echo Please install curl or use Git Bash to run auto_executor.sh
    pause
    exit /b 1
)

REM Backend Health Check
echo ===============================================================================
echo AGENT: Claude Code ^(Backend^)
echo TASK: Verifying backend health check...
echo ===============================================================================
echo.

curl -s -o NUL -w "HTTP Status: %%{http_code}" "%BACKEND_URL%/health"
echo.

if errorlevel 1 (
    echo [FAILED] Backend health check failed
    echo.
    echo NEXT STEPS:
    echo 1. Complete Railway dashboard setup ^(see RAILWAY_DEPLOYMENT.md^)
    echo 2. Add PostgreSQL database
    echo 3. Configure environment variables
    echo 4. Redeploy backend
    echo.
) else (
    echo [SUCCESS] Backend health check passed!
    echo.
    echo Testing API endpoints...
    curl -s "%BACKEND_URL%/api/candidates" >nul
    if errorlevel 1 (
        echo [FAILED] /api/candidates endpoint failed
    ) else (
        echo [SUCCESS] /api/candidates endpoint works!
    )

    curl -s "%BACKEND_URL%/api/governorates" >nul
    if errorlevel 1 (
        echo [FAILED] /api/governorates endpoint failed
    ) else (
        echo [SUCCESS] /api/governorates endpoint works!
    )
)

echo.
echo ===============================================================================
echo AGENT: Cursor Team ^(Frontend^)
echo TASK: Verifying frontend deployment...
echo ===============================================================================
echo.

curl -s -o NUL "%FRONTEND_URL%"
if errorlevel 1 (
    echo [PENDING] Frontend not deployed yet
    echo.
    echo NEXT STEPS:
    echo 1. Build frontend application
    echo 2. Deploy to Vercel
    echo 3. Configure environment variables
) else (
    echo [SUCCESS] Frontend is accessible!
)

echo.
echo ===============================================================================
echo DEPLOYMENT STATUS SUMMARY
echo ===============================================================================
echo.
echo Backend URL:  %BACKEND_URL%
echo Frontend URL: %FRONTEND_URL%
echo.
echo Check deployment_status.json for detailed status
echo.
echo ===============================================================================
echo For Linux/Mac users: Use ./auto_executor.sh for better output
echo ===============================================================================
echo.

pause
