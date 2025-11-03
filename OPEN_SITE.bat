@echo off
echo ========================================
echo  YOUR SITE IS STARTING
echo ========================================
echo.
echo This will open in your browser...
echo.

cd /d "%~dp0\out"
start http://localhost:8080
python -m http.server 8080

pause
