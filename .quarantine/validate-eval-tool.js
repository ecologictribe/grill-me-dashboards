// eval-tool probe parity test — verifies the browser tool's embedded probe
// produces the SAME verdict as grader/grader.v2.js on the reference dashboard,
// and that the tool page's script is syntactically valid with all element IDs present.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = path.join(__dirname, '..');
let failures = 0;
const fail = m => { failures++; console.error('FAIL ' + m); };

const toolHtml = fs.readFileSync(path.join(ROOT, 'eval-tool', 'index.html'), 'utf8');

// 1. Extract the inline <script> blocks and syntax-check the main one
const inlineScripts = [...toolHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
const mainScript = inlineScripts.find(s => s.includes('apllyProbe'));
if (!mainScript) fail('eval-tool | apllyProbe script not found');
else {
    try { new Function(mainScript); console.log('PASS eval-tool | main inline script parses'); }
    catch (e) { fail('eval-tool | main script syntax error: ' + e.message); }
}

// 2. Run the embedded probe against the reference dashboard — expect 4/4,
//    exactly like grader.v2.js reports.
async function runProbeParity() {
    const fnMatch = mainScript && mainScript.match(/function apllyProbe\(\) \{[\s\S]*?\n        \}/);
    if (!fnMatch) { fail('eval-tool | could not extract apllyProbe body'); return; }

    const dashHtml = fs.readFileSync(path.join(ROOT, 'dashboard', 'index.html'), 'utf8');
    // Mirror both the browser iframe and grader.v2.js: EXECUTE the page, let it settle.
    const dom = new JSDOM(dashHtml, { runScripts: 'dangerously', pretendToBeVisual: true });
    await new Promise(r => setTimeout(r, 600));

    // The probe closes over `parent` and `document` inside the real iframe; inject both.
    let posted = null;
    const runner = new Function('parent', 'document', fnMatch[0] + '\napllyProbe();');
    runner({ postMessage: (data) => { posted = data; } }, dom.window.document);
    dom.window.close();

    if (!posted) { fail('eval-tool probe | no postMessage captured'); return; }
    if (posted.source !== 'aplly-eval') fail('eval-tool probe | wrong source tag');
    if (posted.total !== 4) fail(`eval-tool probe | expected 4 gates, got ${posted.total}`);
    if (posted.score !== 4) fail(`eval-tool probe | expected 4/4 on reference dashboard, got ${posted.score}/4 — gate port mismatch with grader.v2.js`);
    else console.log('PASS eval-tool probe | reference dashboard scores ' + posted.score + '/4 — parity with grader.v2.js');
    for (const g of posted.gates || []) {
        console.log(`       Gate ${g.id}: ${g.pass ? 'PASS' : 'FAIL'} — ${g.detail}`);
    }
}

(async function main() {
    await runProbeParity();

    // 3. Element IDs the script wires up must exist in the markup
    for (const id of ['dropzone', 'file-input', 'report-card', 'report-out', 'verdict', 'term-title', 'copy-btn', 'dl-btn', 'share-btn', 'again-btn', 'demo-btn']) {
        if (!toolHtml.includes(`id="${id}"`)) fail(`eval-tool | missing element id="${id}"`);
    }
    // 4. Safety + parity tokens
    for (const token of ["setAttribute('sandbox', 'allow-scripts')", 'srcdoc', 'postMessage', 'last-updated', '../assignments/index.html', '../tutorials/self-grading-kit.html', '../dashboard/index.html', '../VALIDATION.md', '#0072b2', '#e69f00', '#cc79a7', 'beginatzero:true', '1500', '@media(max-width:767px)', 'self-grade-report.txt']) {
        if (!toolHtml.includes(token)) fail(`eval-tool | missing token: ${token}`);
    }
    // Sandbox must be opaque: the setAttribute call itself must not grant allow-same-origin.
    const sandboxLine = toolHtml.match(/setAttribute\('sandbox',[^)]*\)/);
    if (sandboxLine && sandboxLine[0].includes('allow-same-origin')) fail('eval-tool | sandbox grants allow-same-origin — isolation broken!');
    else if (sandboxLine && sandboxLine[0].includes('allow-scripts')) console.log('PASS eval-tool | sandbox is opaque (allow-scripts only, no allow-same-origin) — student scripts isolated');
    else fail('eval-tool | could not find sandbox setAttribute line');

    console.log(failures ? `\n${failures} FAILURE(S)` : '\nEVAL-TOOL CHECKS PASSED');
    process.exit(failures ? 1 : 0);
})();
