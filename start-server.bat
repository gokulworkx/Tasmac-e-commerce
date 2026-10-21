@echo off
title TASMAC Reserve Storefront
cd /d "%~dp0"

echo =============================================================
echo   TASMAC Reserve — Tamil Nadu Official Storefront
echo =============================================================
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo [ERROR] Node.js is not found on your system PATH.
  echo.
  echo You can either:
  echo   1. Install Node.js from https://nodejs.org
  echo   2. Or simply double-click "index.html" to open in your browser!
  echo.
  echo Opening index.html in your browser directly...
  start "" "index.html"
  pause
  exit /b 1
)

echo Starting local server at http://localhost:5500 ...
node server.js
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Server exited with code %ERRORLEVEL%.
  pause
)
