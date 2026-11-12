// grader.v3.js — Layout-Agnostic & Behavioral Spec Grader for Assignment 3
// Upgrades over grader.v2.js:
//   - Gate 1: Checks rendered output for NaN/undefined leaks + visible units/scale context
//             (no longer forces `beginAtZero:true` on non-zero domains like °C or uncertainty cones).
//   - Gate 2: Palette-agnostic CVD dual-encoding check (accepts any accessible palette with
//             non-color cues: shapes, stroke-dasharray, hatch patterns, icons, text badges, aria-labels).
//   - Gate 3: Runtime error-free + live <input type="file"> CSV loader check + <= 2,000 DOM nodes + Canvas/SVG.
//   - Gate 4: Layout-agnostic (F-pattern, Z-pattern, Bento, Pyramid, Narrative allowed) — verifies
//             semantic headings, responsive CSS/Tailwind layout, and visible static/print text.
// Usage: node grader/grader.v3.js dashboard.html

const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');

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
    const runtimeErrors = [];
    const vc = new VirtualConsole();
    vc.on('jsdomError', e => {
        if (!/tailwind|chart|cdn|HTMLCanvasElement/i.test(e.message)) runtimeErrors.push(e.message);
    });

    const dom = new JSDOM(htmlContent, {
        runScripts: 'dangerously',
        pretendToBeVisual: true,
        virtualConsole: vc,
        url: 'file://' + __dirname + '/'
    });
    await new Promise(resolve => setTimeout(resolve, 500));
    const { document } = dom.window;

    console.log('=======================================================');
    console.log(`BEHAVIORAL & LAYOUT-AGNOSTIC GRADER v3: ${targetFile}`);
    console.log('=======================================================\n');

    let passedGates = 0;
    const totalGates = 4;

    // GATE 1: Scale, Unit & Rendering Truth
    {
        console.log('[Gate 1: Scale, Unit & Rendering Truth]');
        const bodyText = (document.body ? document.body.textContent : '') || '';
        const hasLeak = /\b(NaN|undefined|\[object Object\])\b/.test(bodyText);
        const hasUnitsOrScale = /(%|kwh|inr|₹|°c|°f|mins|minutes|hours|sqm|score|prob|ratio|rate|baseline|zero|0\b|confidence|band)/i.test(bodyText);
        const hasVisual = document.querySelectorAll('canvas, svg, table').length > 0;
        if (!hasLeak && hasUnitsOrScale && hasVisual) {
            console.log('  ✅ PASS: Clean rendered output (no NaN/undefined leaks) with explicit unit/scale context.\n');
            passedGates++;
        } else {
            if (hasLeak) console.log('  ❌ Found NaN / undefined / [object Object] in rendered text.');
            if (!hasUnitsOrScale) console.log('  ❌ No explicit measurement units or scale context found in visible text.');
            if (!hasVisual) console.log('  ❌ No canvas, svg, or table element rendered.');
            console.log('');
        }
    }

    // GATE 2: Palette-Agnostic CVD & Dual-Encoding Check
    {
        console.log('[Gate 2: Palette-Agnostic CVD & Dual-Encoding Check]');
        const raw = htmlContent;
        const cues = [];
        if (/[●▲■◆🛑⚠✓✕★]/.test(raw) || document.querySelectorAll('i[class*="fa-"]').length > 0) cues.push('symbols/icons');
        if (/stroke-dasharray|repeating-linear-gradient|pattern/i.test(raw) || document.querySelectorAll('svg circle, svg rect, svg polygon').length >= 2) cues.push('SVG/hatch geometry');
        if (document.querySelectorAll('[aria-label], [data-status], .badge, .pill, [role="status"]').length >= 2) cues.push('text/aria labels');
        if (/(okabe|viridis|cividis|tol|#0072b2|#e69f00|#cc79a7|#28a8e8|#183868|#3c9080)/i.test(raw)) cues.push('accessible palette tokens');
        const hasRawRedGreenTrap = /#ff0000/i.test(raw) && /#00ff00/i.test(raw) && cues.length < 2;

        if (cues.length >= 2 && !hasRawRedGreenTrap) {
            console.log(`  ✅ PASS: Palette-agnostic non-color redundancy verified (${cues.join(', ')}).\n`);
            passedGates++;
        } else {
            console.log(`  ❌ FAIL: Need >= 2 non-color encoding cues (symbols, SVG geometry/dash, aria/text badges); found: ${cues.join(', ') || 'none'}.\n`);
        }
    }

    // GATE 3: Dynamic CSV Readiness, Clean Runtime & DOM Budget
    {
        console.log('[Gate 3: Dynamic Data Readiness & Performance Budget]');
        const totalElements = document.querySelectorAll('*').length;
        const canvasElements = document.querySelectorAll('canvas, svg').length;
        const hasFileInput = document.querySelectorAll('input[type="file"]').length > 0;
        console.log(`  -> Live DOM nodes: ${totalElements} | Canvas/SVG: ${canvasElements} | File loader: ${hasFileInput} | Runtime errors: ${runtimeErrors.length}`);

        if (runtimeErrors.length === 0 && hasFileInput && totalElements <= 2000 && canvasElements > 0) {
            console.log('  ✅ PASS: Zero runtime errors, live CSV <input type="file"> present, and DOM within budget (<= 2,000).\n');
            passedGates++;
        } else {
            if (runtimeErrors.length) console.log(`  ❌ Runtime JS errors: ${runtimeErrors.join('; ')}`);
            if (!hasFileInput) console.log('  ❌ Missing <input type="file"> CSV loader (required for Live Curveball swap).');
            if (totalElements > 2000) console.log(`  ❌ DOM too heavy (${totalElements} > 2,000 nodes).`);
            if (canvasElements === 0) console.log('  ❌ Missing <canvas> or <svg> visualization layer.');
            console.log('');
        }
    }

    // GATE 4: Layout-Agnostic Hierarchy, Responsiveness & Static/Print Truth
    {
        console.log('[Gate 4: Layout-Agnostic Hierarchy, Responsiveness & Static Truth]');
        const norm = normalize(htmlContent);
        const headingsCount = document.querySelectorAll('h1, h2, h3').length;
        const hasLayoutSystem = ['display:grid', 'display:flex', 'grid-template-columns', 'grid-cols-', 'flex-']
            .some(t => norm.includes(t));
        const hasResponsive = /@media\(max-width:/i.test(norm) || /(sm:|md:|lg:|auto-fit|auto-fill|minmax\(|overflow-x-auto)/i.test(htmlContent);
        const visibleChars = ((document.body ? document.body.textContent : '') || '').replace(/\s+/g, ' ').trim().length;

        if (headingsCount >= 2 && hasLayoutSystem && hasResponsive && visibleChars >= 80) {
            console.log(`  ✅ PASS: Layout-agnostic hierarchy verified (${headingsCount} headings, responsive system, ${visibleChars} visible chars).\n`);
            passedGates++;
        } else {
            if (headingsCount < 2) console.log(`  ❌ Only ${headingsCount} h1/h2/h3 headings (need >= 2).`);
            if (!hasLayoutSystem) console.log('  ❌ No grid/flex/Tailwind layout system detected.');
            if (!hasResponsive) console.log('  ❌ No responsive CSS media query, auto-fit grid, or Tailwind responsive classes found.');
            if (visibleChars < 80) console.log('  ❌ Too little visible text — insights/units may be trapped in hover-only tooltips.');
            console.log('');
        }
    }

    dom.window.close();

    console.log('=======================================================');
    console.log(`FINAL SCORE: ${passedGates} / ${totalGates} GATES PASSED (v3)`);
    console.log('=======================================================');
    process.exit(passedGates === totalGates ? 0 : 1);
})();
