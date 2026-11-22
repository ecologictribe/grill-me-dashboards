#!/usr/bin/env node
/**
 * GENERATE-PROJECT-DATASETS.JS
 * Command-line seeded domain dataset generator for Capstone Project Work
 * 
 * Usage:
 *   node scripts/generate-project-datasets.js --student <ID> --domain <forensic|cs|nutrition> [--curveball] [--out <file>]
 *   node scripts/generate-project-datasets.js --all-samples
 */

const fs = require('fs');
const path = require('path');
const engine = require('../gate-challenge/assets/project-engine.js');

const args = process.argv.slice(2);

function getArg(name, def) {
    const idx = args.indexOf(name);
    if (idx !== -1 && idx + 1 < args.length) return args[idx + 1];
    return def;
}

const isAllSamples = args.includes('--all-samples');
const isCurveball = args.includes('--curveball');
const studentId = getArg('--student', 'FS-2026-DEMO');
const domain = getArg('--domain', 'forensic');
const outPath = getArg('--out', null);

if (isAllSamples) {
    const samples = [
        { id: 'FS-2026-8812', domain: 'forensic', file: 'forensic-sample.csv' },
        { id: 'CS-2026-4401', domain: 'cs', file: 'cs-sample.csv' },
        { id: 'NUT-2026-309', domain: 'nutrition', file: 'nutrition-sample.csv' }
    ];
    const outDir = path.join(__dirname, '..', 'gate-challenge', 'data');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    for (const s of samples) {
        const res = engine.generateDataset(s.id, s.domain, false);
        const csv = engine.toCSV(res.data);
        const p = path.join(outDir, s.file);
        fs.writeFileSync(p, csv, 'utf8');
        console.log(`[Generated] ${s.domain.toUpperCase()}: ${p} (${res.rowCount} rows, seed=${res.seed.slice(0, 8)}...)`);
    }
    process.exit(0);
}

const dataset = engine.generateDataset(studentId, domain, isCurveball);
const csvContent = engine.toCSV(dataset.data);

if (outPath) {
    const resolved = path.resolve(process.cwd(), outPath);
    const dir = path.dirname(resolved);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(resolved, csvContent, 'utf8');
    console.log(`[Exported] Seeded dataset (${dataset.rowCount} rows) written to ${resolved}`);
} else {
    console.log(`--- SEEDED DATASET METADATA ---`);
    console.log(`Student ID:   ${dataset.studentId}`);
    console.log(`Domain:       ${dataset.domain}`);
    console.log(`Curveball:    ${dataset.isCurveball}`);
    console.log(`Seed Digest:  ${dataset.seed}`);
    console.log(`Row Count:    ${dataset.rowCount}`);
    console.log(`\n--- CSV PREVIEW (First 5 Rows) ---`);
    console.log(csvContent.split('\n').slice(0, 6).join('\n'));
}
