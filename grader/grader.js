// Aplly.xyz Data Visualization Spec Grader
// Validates dashboard implementations against Anti-Drift Verification Gates.
// Usage: node grader.js dashboard.html

const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const targetFile = process.argv[2] || 'index.html';

if (!fs.existsSync(targetFile)) {
    console.error(`❌ Error: Target file '${targetFile}' not found.`);
    process.exit(1);
}

const htmlContent = fs.readFileSync(targetFile, 'utf8');
const dom = new JSDOM(htmlContent, { runScripts: "outside-only" });
const document = dom.window.document;

console.log(`=======================================================`);
console.log(`APLLY AUTOMATED DATA VIS SPEC GRADER: ${targetFile}`);
console.log(`=======================================================\n`);

let passedGates = 0;
const totalGates = 4;

// GATE 1: Baseline Integrity Check (Zero Baseline Rule)
function checkGate1() {
    console.log('[Gate 1: Baseline Integrity Check]');
    const scriptTags = Array.from(document.querySelectorAll('script')).map(s => s.textContent).join(' ');
    const hasZeroBaseline = scriptTags.includes('beginAtZero: true') || 
                            scriptTags.includes('yMin: 0') || 
                            scriptTags.includes('domain([0') ||
                            scriptTags.includes('min: 0');

    if (hasZeroBaseline) {
        console.log('  ✅ PASS: Strict zero-baseline configuration detected.\n');
        passedGates++;
    } else {
        console.log('  ❌ FAIL: No explicit zero-baseline scale configuration found. Truncated axis risk.\n');
    }
}

// GATE 2: CVD Color Accessibility & Redundancy Check
function checkGate2() {
    console.log('[Gate 2: CVD Accessibility & Palette Check]');
    const hasOkabeIto = htmlContent.includes('#0072B2') || 
                       htmlContent.includes('#E69F00') || 
                       htmlContent.includes('#CC79A7');
    const hasSymbolTokens = htmlContent.includes('●') || 
                            htmlContent.includes('▲') || 
                            htmlContent.includes('🛑') ||
                            htmlContent.includes('circle') ||
                            htmlContent.includes('triangle');

    if (hasOkabeIto && hasSymbolTokens) {
        console.log('  ✅ PASS: Okabe-Ito accessible palette and shape redundancy tokens detected.\n');
        passedGates++;
    } else {
        console.log('  ❌ FAIL: Missing Okabe-Ito color tokens or dual shape redundancy indicators.\n');
    }
}

// GATE 3: DOM Performance Budget Check
function checkGate3() {
    console.log('[Gate 3: DOM Performance Budget Check]');
    const totalElements = document.querySelectorAll('*').length;
    const canvasElements = document.querySelectorAll('canvas, svg').length;

    console.log(`  -> Total DOM nodes rendered: ${totalElements}`);
    console.log(`  -> Active Canvas/SVG layers: ${canvasElements}`);

    if (totalElements <= 1500 && canvasElements > 0) {
        console.log('  ✅ PASS: DOM footprint complies with performance limits (<= 1,500 nodes).\n');
        passedGates++;
    } else {
        console.log('  ❌ FAIL: Excessive DOM elements detected or canvas layer missing.\n');
    }
}

// GATE 4: F-Pattern Structural Grid & Layout Check
function checkGate4() {
    console.log('[Gate 4: F-Pattern Grid Hierarchy Check]');
    const hasGridOrFlex = htmlContent.includes('display: grid') || 
                          htmlContent.includes('display: flex') || 
                          htmlContent.includes('grid-template-columns') ||
                          htmlContent.includes('flex-direction');
    const headingsCount = document.querySelectorAll('h1, h2, h3').length;

    if (hasGridOrFlex && headingsCount >= 2) {
        console.log('  ✅ PASS: Responsive grid/flex layout and visual hierarchy headings verified.\n');
        passedGates++;
    } else {
        console.log('  ❌ FAIL: Lacks modern CSS Grid/Flexbox structures or semantic header hierarchy.\n');
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
