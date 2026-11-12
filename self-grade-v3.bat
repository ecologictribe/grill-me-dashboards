@echo off
setlocal
chcp 65001 >nul 2>nul
title Aplly Self-Grading Kit - grader.v3 (Assignment 3)
cd /d "%~dp0"

echo ==========================================================
echo   APLLY SELF-GRADING KIT  -  grader.v3 (Assignment 3)
echo ==========================================================
echo.

where node >nul 2>nul
if errorlevel 1 (
    echo [X] Node.js is not installed. Download LTS from https://nodejs.org
    pause
    exit /b 1
)

if not exist "node_modules\jsdom" (
    echo [!] Installing jsdom (one-time)...
    call npm install jsdom --no-audit --no-fund --loglevel=error
    if errorlevel 1 (
        echo [X] Setup failed. Check internet connection and retry.
        pause
        exit /b 1
    )
)

set "TARGET=%~1"
if "%TARGET%"=="" (
    echo Drag and drop your Assignment 3 HTML file onto this .bat file,
    echo or run:  self-grade-v3.bat path\to\your-dashboard.html
    pause
    exit /b 1
)

echo Grading (v3 Behavioral ^& Layout-Agnostic): %TARGET%
echo ----------------------------------------------------------
node grader\grader.v3.js "%TARGET%" > self-grade-v3-report.txt 2>&1
type self-grade-v3-report.txt
echo ----------------------------------------------------------
echo.
echo Saved copy to: self-grade-v3-report.txt
pause
exit /b 0
