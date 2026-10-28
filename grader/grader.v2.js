// grader.v2.js — Hardened grader derived from the tutorial's grader.js.
// Fixes identified during validation (see VALIDATION.md):
//   - Gate 2: original used OR across the three Okabe-Ito hexes, so a dashboard
//     with a single palette color passed "CVD compliance". v2 requires ALL three
//     hex tokens (case-insensitive) and at least TWO distinct shape tokens.
//   - Gate 3: original counted only the static DOM (runScripts: "outside-only"
//     never executes page scripts), so a page injecting 10k nodes at runtime
//     still passed. v2 executes the page, waits for the first render, and
//     counts the live DOM.
//   - Gate 4: original missed `display:grid` without a space (common minified
//     form). v2 normalizes whitespace and also checks for a mobile media query.
// Usage: node grader.v2.js dashboard.html

const fs = require('fs');
const { JSDOM } = require('jsdom');

const targetFile = process.argv[2] || 'index.html';

if (!fs.existsSync(targetFile)) {
    console.error(`❌ Error: Target file '${targetFile}' not found.`);
    process.exit(1);
}

const htmlContent = fs.readFileSync(targetFile, 'utf8');

function normalize(s) {
    return s.toLowerCase().replace(/\s+/g, '');
}

(async function main() {
    // Execute the page's scripts and let the first render settle before grading.
    const dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        url: 'file://' + __dirname + '/'
    });
    const { document } = dom.window;
    await new Promise((resolve) => setTimeout(resolve, 500));
    dom.window.close();

    console.log(`=======================================================`);
    console.log(`HARDENED DATA VIS SPEC GRADER v2: ${targetFile}`);
    console.log(`=======================================================\n`);

    let passedGates = 0;
    const totalGates = 4;

    // GATE 1: Baseline Integrity (zero baseline must be explicitly declared)
    function checkGate1() {
        console.log('[Gate 1: Baseline Integrity Check]');
        const scriptText = normalize(
            Array.from(document.querySelectorAll('script')).map(s => s.textContent).join(' ')
        );
        const hasZeroBaseline = scriptText.includes('beginatzero:true') ||
                                scriptText.includes('ymin:0') ||
                                scriptText.includes('domain([0') ||
                                scriptText.includes('min:0');
        if (hasZeroBaseline) {
            console.log('  ✅ PASS: Explicit zero-baseline configuration detected in executed page source.\n');
            passedGates++;
        } else {
            console.log('  ❌ FAIL: No explicit zero-baseline scale configuration found. Truncated axis risk.\n');
        }
    }

    // GATE 2: CVD accessibility — ALL three Okabe-Ito tokens + >= 2 shape tokens
    function checkGate2() {
        console.log('[Gate 2: CVD Accessibility & Palette Check]');
        const raw = htmlContent.toLowerCase();
        const required = { '#0072b2': 'normal (blue)', '#e69f00': 'warning (amber)', '#cc79a7': 'critical (magenta)' };
        const missing = Object.keys(required).filter(hex => !raw.includes(hex));
        const shapes = ['●', '▲', '🛑'].filter(sym => htmlContent.includes(sym));
        if (missing.length === 0 && shapes.length >= 2) {
            console.log(`  ✅ PASS: All 3 Okabe-Ito tokens present + ${shapes.length} shape redundancy tokens (${shapes.join(' ')}).\n`);
            passedGates++;
        } else {
            if (missing.length) console.log(`  ❌ Missing palette tokens: ${missing.map(h => `${h} (${required[h]})`).join(', ')}`);
            if (shapes.length < 2) console.log(`  ❌ Only ${shapes.length} shape token(s) found — dual encoding needs >= 2.`);
            console.log('');
        }
    }

    // GATE 3: Live DOM performance budget (post-execution node count + canvas layer)
    function checkGate3() {
        console.log('[Gate 3: DOM Performance Budget Check] (measured after script execution)');
        const totalElements = document.querySelectorAll('*').length;
        const canvasElements = document.querySelectorAll('canvas, svg').length;
        console.log(`  -> Live DOM nodes after render: ${totalElements}`);
        console.log(`  -> Active Canvas/SVG layers: ${canvasElements}`);
        if (totalElements <= 1500 && canvasElements > 0) {
            console.log('  ✅ PASS: Live DOM footprint within budget (<= 1,500 nodes) with dedicated canvas layer.\n');
            passedGates++;
        } else {
            console.log('  ❌ FAIL: Excessive live DOM nodes or missing canvas layer.\n');
        }
    }

    // GATE 4: F-pattern structure — normalized CSS check + headings + responsive breakpoint
    function checkGate4() {
        console.log('[Gate 4: F-Pattern Grid Hierarchy Check]');
        const norm = normalize(htmlContent);
        const hasGridOrFlex = ['display:grid', 'display:flex', 'grid-template-columns', 'grid-template-areas', 'flex-direction']
            .some(token => norm.includes(token));
        const headingsCount = document.querySelectorAll('h1, h2, h3').length;
        const hasResponsive = norm.includes('@media(max-width:767px)') || norm.includes('@media(max-width:768px)');
        if (hasGridOrFlex && headingsCount >= 2 && hasResponsive) {
            console.log(`  ✅ PASS: Grid/flex layout, ${headingsCount} semantic headings, and a mobile breakpoint verified.\n`);
            passedGates++;
        } else {
            if (!hasGridOrFlex) console.log('  ❌ No grid/flex layout tokens found.');
            if (headingsCount < 2) console.log(`  ❌ Only ${headingsCount} h1/h2/h3 headings (need >= 2).`);
            if (!hasResponsive) console.log('  ❌ No mobile breakpoint (< 768px) media query found.');
            console.log('');
        }
    }

    checkGate1();
    checkGate2();
    checkGate3();
    checkGate4();

    console.log(`=======================================================`);
    console.log(`FINAL SCORE: ${passedGates} / ${totalGates} GATES PASSED`);
    console.log(`=======================================================`);

    if (passedGates === totalGates) {
        console.log('🌟 Dashboard passes specification gates. Ready for deployment.');
        process.exit(0);
    } else {
        console.log('⚠️ Verification failed. Remediate flagged gates before shipping.');
        process.exit(1);
    }
})();
