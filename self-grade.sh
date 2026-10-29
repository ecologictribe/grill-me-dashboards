#!/usr/bin/env bash
# Aplly Self-Grading Kit - mac / Linux version
# Run it with:  bash self-grade.sh
# To grade YOUR report:  bash self-grade.sh path/to/your-dashboard.html
cd "$(dirname "$0")"

echo "=========================================================="
echo "  APLLY SELF-GRADING KIT  -  grader.v2"
echo "=========================================================="
echo

# Step 1: is Node.js installed?
if ! command -v node >/dev/null 2>&1; then
    echo "[X] Node.js is not installed on this computer."
    echo
    echo "    Open https://nodejs.org, download the LTS version, install it,"
    echo "    then run this script again. One-time, free, no coding needed."
    exit 1
fi

# Step 2: is the grader engine (jsdom) installed?
if [ ! -d "node_modules/jsdom" ]; then
    echo "[!] First-time setup: installing the grader engine (jsdom)..."
    echo "    One-time download, about a minute, needs internet."
    echo
    if ! npm install jsdom --no-audit --no-fund --loglevel=error; then
        echo
        echo "[X] Setup failed. Check your internet and run this again,"
        echo "    or ask your trainer to do this step once."
        exit 1
    fi
    echo
    echo "[OK] Setup complete. You will not need this step again."
    echo
fi

# Step 3: grade the target (default = reference dashboard)
TARGET="${1:-dashboard/index.html}"

echo "Grading: $TARGET"
echo "----------------------------------------------------------"
node grader/grader.v2.js "$TARGET" 2>&1 | tee self-grade-report.txt
echo "----------------------------------------------------------"
echo
echo "A copy of this report was saved as: self-grade-report.txt"
echo "Screenshot it (or this window) and paste it into your PDF."
echo
