@echo off
setlocal
chcp 65001 >nul 2>nul
title Aplly Self-Grading Kit
cd /d "%~dp0"

echo ==========================================================
echo   APLLY SELF-GRADING KIT  -  grader.v2
echo ==========================================================
echo.

rem --- Step 1: is Node.js installed?
where node >nul 2>nul
if errorlevel 1 (
    echo [X] Node.js is not installed on this computer.
    echo.
    echo     The grader needs the free Node.js runtime - a one-time
    echo     install, no coding knowledge required:
    echo       1. Open https://nodejs.org in your browser
    echo       2. Download the LTS version, install it: Next, Next, Finish
    echo       3. Double-click this file again
    echo.
    pause
    exit /b 1
)

rem --- Step 2: is the grader engine - jsdom - installed?
if not exist "node_modules\jsdom" (
    echo [!] First-time setup: installing the grader engine - jsdom -
    echo     One-time download, about a minute, needs internet.
    echo.
    call npm install jsdom --no-audit --no-fund --loglevel=error
    if errorlevel 1 (
        echo.
        echo [X] Setup failed. Check your internet connection and run
        echo     this file again - or ask your trainer to do this step once.
        pause
        exit /b 1
    )
    echo.
    echo [OK] Setup complete. You will not need this step again.
    echo.
)

rem --- Step 3: which file to grade?
rem     Default = the reference dashboard. To grade YOUR report, simply
rem     drag and drop your .html file onto this .bat file in Explorer.
set "TARGET=%~1"
if "%TARGET%"=="" set "TARGET=dashboard\index.html"

echo Grading: %TARGET%
echo ----------------------------------------------------------
node grader\grader.v2.js "%TARGET%" > self-grade-report.txt 2>&1
type self-grade-report.txt
echo ----------------------------------------------------------
echo.
echo A copy of this report was saved as: self-grade-report.txt
echo Screenshot this window or the report file and paste it into your PDF.
echo.
pause
exit /b 0
