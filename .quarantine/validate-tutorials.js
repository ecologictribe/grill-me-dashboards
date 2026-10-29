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

    const dsDir = path.join(__dirname, '..', 'datasets');
    const csvs = fs.readdirSync(dsDir).filter(f => f.endsWith('.csv'));

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
        if (!html.includes('name="last-updated"')) fail(`${f} | missing <meta name="last-updated">`);
        if (!html.includes('Last updated: 29 Oct 2026')) fail(`${f} | missing visible last-updated footer stamp`);

        if (f.startsWith('part-')) {
            if (gates !== 5) fail(`${f} | expected 5 rubric gates (Gate 0 + 4), got ${gates}`);
            if (grill !== 1) fail(`${f} | missing grill-step section`);
            if (!gate0) fail(`${f} | missing GATE 0 process gate`);
            if (!html.includes('grill-method.html')) fail(`${f} | no link to method page`);
            // cross-linking: every part links method, prompts, datasets, assignment
            if (!html.includes('id="practice"')) fail(`${f} | missing practice cross-ref box`);
            if (!html.includes('../prompts/system_prompt_grill_me.md')) fail(`${f} | no link to source prompt`);
            if (!html.includes('../datasets/challenge-')) fail(`${f} | no per-part dataset links`);
            if (!html.includes('../assignments/index.html')) fail(`${f} | no link to assignment`);
        }
        if (f === 'grill-method.html' && gates !== 4) fail(`grill-method | expected 4 method gates, got ${gates}`);
        if (f === 'grill-method.html') {
            if (!html.includes('id="toolkit"')) fail('grill-method | missing toolkit table');
            for (const link of ['../prompts/system_prompt_grill_me.md', '../prompts/code_generation_prompt.md', '../specs/DASH-SPEC-2026-081.md', '../dashboard/index.html', '../grader/grader.v2.js', '../challenges/challenges.txt', '../datasets/index.html', '../assignments/index.html']) {
                if (!html.includes(link)) fail(`grill-method | toolkit missing link: ${link}`);
            }
        }
        if (f === 'index.html' && !html.includes('grill-method.html')) fail('index.html | missing link to method page');
        if (f === 'index.html' && !html.includes('../assignments/index.html')) fail('index.html | missing link to assignment page');
        if (f === 'index.html') {
            if (!html.includes('id="working-files"')) fail('index.html | missing working-files strip');
            for (const link of ['../prompts/system_prompt_grill_me.md', '../prompts/code_generation_prompt.md', '../challenges/challenges.txt', '../datasets/index.html']) {
                if (!html.includes(link)) fail(`index.html | working-files missing link: ${link}`);
            }
        }
    }

    // Assignment page lives in assignments/ (own folder, not part of the tutorial series)
    {
        const f = 'assignments/index.html';
        const html = fs.readFileSync(path.join(__dirname, '..', 'assignments', 'index.html'), 'utf8');
        const errors = [];
        const environmental = m => m.includes('tailwind is not defined');
        const vc = new VirtualConsole();
        vc.on('jsdomError', e => { if (!environmental(e.message)) errors.push(e.message); });
        vc.on('error', (...a) => { const m = a.join(' '); if (!environmental(m)) errors.push(m); });
        const dom = new JSDOM(html, { runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc, url: 'https://aplly.xyz/assignments/index.html' });
        await new Promise(r => setTimeout(r, 300));
        const doc = dom.window.document;
        const cards = doc.querySelectorAll('.chal-card').length;
        const selfInputs = doc.querySelectorAll('.score-input.self').length;
        const trainerInputs = doc.querySelectorAll('.score-input.trainer').length;
        const pbi = doc.querySelectorAll('.pbi-chk').length;
        dom.window.close();

        if (errors.length) fail(`${f} | script errors: ${errors.join(' ; ')}`);
        else console.log(`PASS ${f} | chal-cards: ${cards} | self/trainer: ${selfInputs}/${trainerInputs} | pbi-bonus: ${pbi}`);
        if (!html.includes('name="last-updated"')) fail(`${f} | missing <meta name="last-updated">`);
        if (!html.includes('Last updated: 29 Oct 2026')) fail(`${f} | missing visible last-updated footer stamp`);
        if (cards !== 20) fail(`assignment | expected 20 challenges, got ${cards}`);
        if (selfInputs !== trainerInputs) fail(`assignment | self/trainer input mismatch (${selfInputs}/${trainerInputs})`);
        if (pbi !== 3) fail(`assignment | expected 3 Power BI bonus checkboxes, got ${pbi}`);
        if (!html.includes('../datasets/index.html')) fail('assignment | missing link to datasets catalog');
        if (!html.includes('../tutorials/grill-method.html')) fail('assignment | missing link to method page');
        if (!html.includes('tree/main/datasets')) fail('assignment | missing link to GitHub datasets folder');
        // per-card dataset download links (C13 has two sheets -> 21 links for 20 cards)
        const cardDsLinks = (html.match(/class="ds-link/g) || []).length;
        if (cardDsLinks < 21) fail(`assignment | expected >=21 per-card dataset links, got ${cardDsLinks}`);
        const cardMLinks = (html.match(/class="m-link/g) || []).length;
        if (cardMLinks !== 20) fail(`assignment | expected 20 per-card method links, got ${cardMLinks}`);
        for (const link of ['../prompts/system_prompt_grill_me.md', '../prompts/code_generation_prompt.md', '../grader/grader.v2.js', '../specs/DASH-SPEC-2026-081.md', '../dashboard/index.html', '../challenges/challenges.txt', '../tutorials/index.html']) {
            if (!html.includes(link)) fail(`assignment | toolkit missing link: ${link}`);
        }
        const dsHrefs = [...html.matchAll(/class="ds-link[^"]*" href="\.\.\/datasets\/([^"]+\.csv)"/g)].map(m => m[1]);
        const missingCsv = dsHrefs.filter(c => !csvs.includes(c));
        if (missingCsv.length) fail(`assignment | dataset links point to missing files: ${missingCsv}`);
        // self-evaluation section
        if (!html.includes('id="self-eval"')) fail('assignment | missing self-evaluation section');
        for (const token of ['screenshot', 'Self-Evaluation', 'Win + Shift + S', 'Trainer column blank']) {
            if (!html.includes(token)) fail(`assignment | self-eval missing token: ${token}`);
        }
        // UX-REVIEW implementations (see assignments/UX-REVIEW.md)
        for (const id of ['toc-bar', 'countdown-chip', 'trio-status', 'print-scorecard', 'reset-scores', 'restored-chip', 'sub-A', 'sub-B', 'sub-D', 'sub-E', 'overview', 'timeline', 'workflow', 'declaration', 'presentation']) {
            if (!html.includes(`id="${id}"`)) fail(`assignment | missing UX element id="${id}"`);
        }
        const trioBtns = doc.querySelectorAll('.trio-btn').length;
        if (trioBtns !== 20) fail(`assignment | expected 20 trio buttons, got ${trioBtns}`);
        const declBlocks = doc.querySelectorAll('.decl-details').length;
        if (declBlocks !== 3) fail(`assignment | expected 3 declaration report blocks, got ${declBlocks}`);
        const labelled = doc.querySelectorAll('.score-input[aria-label]').length;
        if (labelled !== selfInputs + trainerInputs) fail(`assignment | aria-labels ${labelled}/${selfInputs + trainerInputs} score inputs`);
        if (!/@media print/.test(html)) fail('assignment | missing print stylesheet');
        if (!html.includes('body.print-scorecard')) fail('assignment | missing print-scorecard mode');
        for (const token of ['legacyCopy', 'scrollIntoView', 'apllyAssignmentTrio']) {
            if (!html.includes(token)) fail(`assignment | missing UX JS feature: ${token}`);
        }
        for (const token of ['eflow', '5 Nov 2026', '29 Oct 2026', 'Power BI', 'presentation']) {
            if (!html.includes(token)) fail(`assignment | missing key token: ${token}`);
        }
    }

    // Content coverage: all 22 challenge numbers present across parts
    const parts = [1, 2, 3, 4].map(i => fs.readFileSync(path.join(dir, `part-${i}.html`), 'utf8')).join('');
    const missing = [];
    for (let n = 1; n <= 22; n++) if (!new RegExp(`chal-num">${n}<`).test(parts)) missing.push(n);
    if (missing.length) fail(`challenge coverage, missing: ${missing}`); else console.log('PASS all 22 challenges covered across parts 1-4');

    // Datasets: 21 CSVs, themed catalog links every file, key traps intact
    if (csvs.length < 21) fail(`datasets | expected >=21 CSVs, got ${csvs.length}`);
    if (!fs.existsSync(path.join(dsDir, 'README.md'))) fail('datasets | missing README.md');
    if (!fs.existsSync(path.join(__dirname, '..', 'scripts', 'generate-datasets.js'))) fail('scripts | missing generate-datasets.js');

    const dsHtml = fs.readFileSync(path.join(dsDir, 'index.html'), 'utf8');
    const dsDom = new JSDOM(dsHtml);
    const dsCards = dsDom.window.document.querySelectorAll('.ds-card').length;
    if (dsCards !== 20) fail(`datasets/index.html | expected 20 dataset cards, got ${dsCards}`);
    const hrefs = [...dsHtml.matchAll(/href="([^"]+\.csv)"/g)].map(m => m[1]);
    const broken = hrefs.filter(h => !csvs.includes(h));
    if (broken.length) fail(`datasets/index.html | broken CSV links: ${broken}`);
    const unlinked = csvs.filter(c => !hrefs.includes(c));
    if (unlinked.length) fail(`datasets/index.html | CSVs not linked from catalog: ${unlinked}`);
    const dsUse = (dsHtml.match(/class="ds-use/g) || []).length;
    if (dsUse !== 20) fail(`datasets/index.html | expected 20 per-card method chips, got ${dsUse}`);
    const dsUpd = (dsHtml.match(/class="ds-upd"/g) || []).length;
    if (dsUpd !== 20) fail(`datasets/index.html | expected 20 per-card timestamp stamps, got ${dsUpd}`);
    if (!dsHtml.includes('name="last-updated"')) fail('datasets/index.html | missing last-updated meta tag');
    // dataset manifest: meta.json covers every CSV with a timestamp
    const meta = JSON.parse(fs.readFileSync(path.join(dsDir, 'meta.json'), 'utf8'));
    if (!meta.last_updated) fail('meta.json | missing top-level last_updated');
    const metaMissing = csvs.filter(c => !meta.files[c] || !meta.files[c].last_updated);
    if (metaMissing.length) fail(`meta.json | CSVs missing from manifest: ${metaMissing}`);
    const metaExtra = Object.keys(meta.files).filter(f => !csvs.includes(f));
    if (metaExtra.length) fail(`meta.json | manifest entries without a CSV: ${metaExtra}`);
    if (meta.file_count !== csvs.length) fail(`meta.json | file_count ${meta.file_count} != ${csvs.length} CSVs`);
    if (!failures) console.log(`PASS datasets/meta.json | ${csvs.length} files stamped ${meta.last_updated}`);
    for (const link of ['../tutorials/grill-method.html', '../tutorials/index.html', '../assignments/index.html#challenges', '../challenges/challenges.txt', '../prompts/system_prompt_grill_me.md']) {
        if (!dsHtml.includes(link)) fail(`datasets/index.html | missing cross-link: ${link}`);
    }
    dsDom.window.close();

    const steps3 = fs.readFileSync(path.join(dsDir, 'challenge-03-missing-tuesday.csv'), 'utf8');
    if (!/,,outage/.test(steps3)) fail('challenge-03 | missing outage/null rows');
    const rows8 = fs.readFileSync(path.join(dsDir, 'challenge-08-recycling-rows.csv'), 'utf8').trim().split('\n').length - 1;
    if (rows8 !== 1200) fail(`challenge-08 | expected 1200 data rows, got ${rows8}`);
    const gps18 = fs.readFileSync(path.join(dsDir, 'challenge-18-bus-gps.csv'), 'utf8');
    if (!gps18.includes('gps_live') || !gps18.includes('daily_log')) fail('challenge-18 | missing mixed-cadence sources');
    if (!failures) console.log(`PASS datasets | ${csvs.length} CSVs | catalog: ${dsCards} cards, ${hrefs.length} links, 0 broken`);

    // Master challenge dataset: challenges.txt structure (Part A/B/C/D)
    const cdb = fs.readFileSync(path.join(__dirname, '..', 'challenges', 'challenges.txt'), 'utf8');
    const coverage = (cdb.match(/\*\*COVERAGE:\*\*/g) || []).length;
    if (coverage !== 22) fail(`challenges.txt | expected 22 COVERAGE lines, got ${coverage}`);
    const openCases = (cdb.match(/case: OPEN/g) || []).length;
    if (openCases !== 7) fail(`challenges.txt | expected 7 OPEN failure modes, got ${openCases}`);
    for (let n = 1; n <= 20; n++) if (!new RegExp(`C${n}\\s*·`).test(cdb)) fail(`challenges.txt | missing case C${n}`);
    if (!cdb.includes('PART D')) fail('challenges.txt | missing Part D contribution template');
    if (!failures) console.log(`PASS challenges.txt | 22 coverage lines | C1-C20 present | ${openCases} open proposals (C21-C27) | template`);

    // Root landing hub (GitHub Pages entry point)
    const rootHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const rootDom = new JSDOM(rootHtml);
    const hubCards = rootDom.window.document.querySelectorAll('.hub-card').length;
    if (hubCards !== 8) fail(`root index.html | expected 8 hub cards, got ${hubCards}`);
    if (!rootHtml.includes('name="last-updated"')) fail('root index.html | missing last-updated meta tag');
    for (const link of ['tutorials/index.html', 'tutorials/grill-method.html', 'assignments/index.html', 'datasets/index.html', 'article/index.html', 'dashboard/index.html', 'challenges/challenges.txt', 'prompts/system_prompt_grill_me.md', 'VALIDATION.md']) {
        if (!rootHtml.includes(link)) fail(`root index.html | missing hub link: ${link}`);
    }
    rootDom.window.close();
    if (!failures) console.log(`PASS root index.html | ${hubCards} hub cards, all entry points linked`);

    console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL CHECKS PASSED');
    process.exit(failures ? 1 : 0);
})();
