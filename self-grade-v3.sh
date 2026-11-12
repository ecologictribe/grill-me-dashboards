#!/usr/bin/env bash
# Aplly Self-Grading Kit — v3 (Assignment 3: Behavioral & Layout-Agnostic)
# Usage: bash self-grade-v3.sh path/to/your-dashboard.html
cd "$(dirname "$0")"

echo "=========================================================="
echo "  APLLY SELF-GRADING KIT  -  grader.v3 (Assignment 3)"
echo "=========================================================="
echo

if ! command -v node >/dev/null 2>&1; then
    echo "[X] Node.js is not installed. Download LTS from https://nodejs.org"
    exit 1
fi

if [ ! -d "node_modules/jsdom" ]; then
    echo "[!] Installing jsdom (one-time)..."
    npm install jsdom --no-audit --no-fund --loglevel=error || exit 1
fi

if [ -z "$1" ]; then
    echo "Usage: bash self-grade-v3.sh path/to/your-dashboard.html"
    exit 1
fi

TARGET="$1"
echo "Grading (v3 Behavioral & Layout-Agnostic): $TARGET"
echo "----------------------------------------------------------"
node grader/grader.v3.js "$TARGET" 2>&1 | tee self-grade-v3-report.txt
echo "----------------------------------------------------------"
echo "Saved copy to: self-grade-v3-report.txt"
