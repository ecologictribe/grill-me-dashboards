// One-off probe: load each tutorial page in jsdom (scripts executing),
// report page errors, and assert the improved series structure:
//  - grill-step section + scoped copyable prompt in all 4 parts
//  - Gate 0 (Spec-First process gate) in all 4 part rubrics
//  - all 22 challenges covered
//  - method page present with method rubric
// Not a deliverable; lives in .quarantine.
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require('jsdom');

const dir = path.join(__dirname, '..', 'tutorials');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

(async () => {
    let failures = 0;
    const fail = msg => { failures++; console.log('FAIL ' + msg); };

    for (const f of files) {
        const errors = [];
        const environmental = m => m.includes('tailwind is not defined'); // external CDN not fetched in jsdom
        const vc = new VirtualConsole();
        vc.on('jsdomError', e => { if (!environmental(e.message)) errors.push(e.message); });
        vc.on('error', (...a) => { const m = a.join(' '); if (!environmental(m)) errors.push(m); });
        const html = fs.readFileSync(path.join(dir, f), 'utf8');
        const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://aplly.xyz/tutorials/' + f });
        await new Promise(r => setTimeout(r, 300));
        const doc = dom.window.document;
        const gates = doc.querySelectorAll('#gate-list input').length;
        const cards = doc.querySelectorAll('.chal-card').length;
        const grill = doc.querySelectorAll('#grill-step').length;
        const gate0 = Array.from(doc.querySelectorAll('#gate-list .font-bold')).some(el => el.textContent.includes('GATE 0'));
        const selfInputs = doc.querySelectorAll('.score-input.self').length;
        const trainerInputs = doc.querySelectorAll('.score-input.trainer').length;
        const pbi = doc.querySelectorAll('.pbi-chk').length;
        dom.window.close();

        if (errors.length) fail(`${f} | script errors: ${errors.join(' ; ')}`);
        else console.log(`PASS ${f} | chal-cards: ${cards} | gates: ${gates} | grill-step: ${grill} | gate0: ${gate0}`);

        if (f.startsWith('part-')) {
            if (gates !== 5) fail(`${f} | expected 5 rubric gates (Gate 0 + 4), got ${gates}`);
            if (grill !== 1) fail(`${f} | missing grill-step section`);
            if (!gate0) fail(`${f} | missing GATE 0 process gate`);
            if (!html.includes('grill-method.html')) fail(`${f} | no link to method page`);
        }
        if (f === 'grill-method.html' && gates !== 4) fail(`grill-method | expected 4 method gates, got ${gates}`);
        if (f === 'index.html' && !html.includes('grill-method.html')) fail('index.html | missing link to method page');
        if (f === 'index.html' && !html.includes('assignment.html')) fail('index.html | missing link to assignment page');
        if (f === 'assignment.html') {
            if (cards !== 20) fail(`assignment | expected 20 challenges, got ${cards}`);
            if (selfInputs !== trainerInputs) fail(`assignment | self/trainer input mismatch (${selfInputs}/${trainerInputs})`);
            if (pbi !== 3) fail(`assignment | expected 3 Power BI bonus checkboxes, got ${pbi}`);
            for (const token of ['eflow', '5 Nov 2026', '29 Oct 2026', 'Power BI', 'presentation']) {
                if (!html.includes(token)) fail(`assignment | missing key token: ${token}`);
            }
        }
    }

    // Content coverage: all 22 challenge numbers present across parts
    const parts = [1, 2, 3, 4].map(i => fs.readFileSync(path.join(dir, `part-${i}.html`), 'utf8')).join('');
    const missing = [];
    for (let n = 1; n <= 22; n++) if (!new RegExp(`chal-num">${n}<`).test(parts)) missing.push(n);
    if (missing.length) fail(`challenge coverage, missing: ${missing}`); else console.log('PASS all 22 challenges covered across parts 1-4');

    console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL CHECKS PASSED');
    process.exit(failures ? 1 : 0);
})();
