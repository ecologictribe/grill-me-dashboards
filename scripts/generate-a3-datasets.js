/*
 * Synthetic multi-trap dataset generator for Assignment 3 ("AI Autopsy & Live Curveball").
 * Deterministic (seeded PRNG).
 *
 * Student usage (writes 4 mystery packs to assignments/data/):
 *   node scripts/generate-a3-datasets.js
 *
 * Trainer-only curveball generation (writes hidden v2 files to var/a3-curveballs/, gitignored):
 *   node scripts/generate-a3-datasets.js --curveball 20261120
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const cbIdx = args.indexOf('--curveball');
const isCurveball = cbIdx !== -1;
const seed = isCurveball ? (parseInt(args[cbIdx + 1], 10) || 20261120) : 20261113;

const OUT = isCurveball
    ? path.join(__dirname, '..', 'var', 'a3-curveballs')
    : path.join(__dirname, '..', 'assignments', 'data');
fs.mkdirSync(OUT, { recursive: true });

// ---- seeded PRNG (mulberry32) ----
function rng(s) {
    let a = s >>> 0;
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const R = rng(seed);
const rand = (lo, hi) => lo + R() * (hi - lo);
const randInt = (lo, hi) => Math.floor(rand(lo, hi + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (dt, n) => new Date(dt.getTime() + n * 86400000);
const startDate = (y, m, d = 1) => new Date(Date.UTC(y, m - 1, d));

const FIRST = ['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Reyansh','Krishna','Ishaan','Rohan','Ananya','Diya','Aadhya','Saanvi','Myra','Anika','Navya','Kiara','Pari','Riya','Kabir','Advait','Dhruv','Yash','Meera','Tara','Kavya','Ira','Zara','Aisha'];
const LAST = ['Sharma','Verma','Gupta','Singh','Mehta','Patel','Reddy','Nair','Iyer','Chopra','Malhotra','Banerjee','Das','Kulkarni','Joshi'];

const MANIFEST = [];
function writeCsv(name, header, rows) {
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n') + '\n';
    fs.writeFileSync(path.join(OUT, name), csv, 'utf8');
    MANIFEST.push({ file: name, rows: rows.length, bytes: Buffer.byteLength(csv, 'utf8') });
    console.log(`  ${name}  (${rows.length} rows, ${Math.max(1, Math.round(csv.length / 1024))} KB)`);
}

console.log(isCurveball
    ? `Generating TRAINER CURVEBALL datasets (seed ${seed}) -> var/a3-curveballs/`
    : `Generating Assignment 3 Mystery Packs (seed ${seed}) -> assignments/data/`);

const suffix = isCurveball ? '-v2-curveball.csv' : '.csv';

/* PACK ALPHA — Campus Solar & Weather Operations
 * Traps: (1) 66% confidence cone band_low..high exceeded ~34% of days,
 *        (2) offline inverter days have empty actual_kwh (not 0),
 *        (3) NODE-B logs ambient_temp in Fahrenheit while NODE-A/C log Celsius.
 */
{
    const days = isCurveball ? 62 : 48;
    const rows = [];
    let dt = startDate(2026, 9, 15);
    const nodes = isCurveball ? ['NODE-A', 'NODE-B', 'NODE-C', 'NODE-D'] : ['NODE-A', 'NODE-B', 'NODE-C'];
    for (let i = 0; i < days; i++) {
        const node = nodes[i % nodes.length];
        const forecast = round(420 + Math.sin(i / 4) * 55 + rand(-12, 12), 1);
        const halfBand = round(isCurveball && i >= 48 ? rand(38, 65) : rand(22, 34), 1);
        const low = round(forecast - halfBand, 1);
        const high = round(forecast + halfBand, 1);
        const isOutage = (i >= 27 && i <= 29) || (isCurveball && i >= 53 && i <= 56);

        let actual = '';
        let state = 'offline';
        if (!isOutage) {
            state = 'online';
            const outside = (i % 3 === 0) || (isCurveball && i >= 50 && i % 2 === 0);
            const delta = outside ? pick([-1, 1]) * rand(halfBand + 14, halfBand + 88) : rand(-halfBand * 0.8, halfBand * 0.8);
            actual = round(Math.max(45, forecast + delta), 1);
        }

        const tempC = round(24 + Math.sin(i / 6) * 4 + rand(-1.5, 2.5), 1);
        const isF = node === 'NODE-B' || node === 'NODE-D';
        const tempVal = isF ? round(tempC * 9 / 5 + 32, 1) : tempC;
        const tempUnit = isF ? 'F' : 'C';

        rows.push([iso(dt), node, forecast, low, high, actual, state, tempVal, tempUnit]);
        dt = addDays(dt, 1);
    }
    writeCsv(`a3-pack-alpha${suffix}`, ['date', 'node_id', 'forecast_kwh', 'band_low_kwh', 'band_high_kwh', 'actual_kwh', 'inverter_state', 'ambient_temp', 'temp_unit'], rows);
}

/* PACK BETA — Annual Sports & Merit Summary
 * Traps: (1) event_stage has prelim + final duplicate participants,
 *        (2) right-skewed scores (mean pulled ~8 pts above median),
 *        (3) PII columns (student_name, phone_ext, medical_note) + quirky reported_index string scale.
 */
{
    const baseStudents = isCurveball ? 45 : 36;
    const houses = isCurveball ? ['Vanguard', 'Zenith', 'Orion', 'Aurora', 'North'] : ['Vanguard', 'Zenith', 'Orion', 'Aurora'];
    const events = ['100m Sprint', '400m Relay', 'Long Jump', 'Quiz Bowl', 'Robotics Trial'];
    const notes = ['None', 'None', 'None', 'None', 'Asthma inhaler carried', 'Mild knee brace', 'Peanut allergy - EpiPen', 'Spectacles required'];
    const rows = [];
    let rec = 3001;

    for (let i = 0; i < baseStudents; i++) {
        const sName = `${FIRST[i % FIRST.length]} ${LAST[(i * 3) % LAST.length]}`;
        const phone = `ext-${4100 + i * 7}`;
        const med = notes[(i * 5) % notes.length];
        const house = houses[i % houses.length];
        const event = events[i % events.length];
        const elite = i >= baseStudents - (isCurveball ? 7 : 5);
        const prelimScore = elite ? randInt(94, 99) : randInt(52, 69);
        // Lexicographical / scale mismatch trap in reported_index
        const repIndex = `${prelimScore}`;
        rows.push([rec++, `"${sName}"`, phone, `"${med}"`, house, `"${event}"`, 'prelim', repIndex, prelimScore]);

        // Finalists appear a second time — naive SUM() double-counts their house/student points
        if (i % 3 === 0) {
            const finalScore = elite ? randInt(96, 100) : randInt(58, 74);
            rows.push([rec++, `"${sName}"`, phone, `"${med}"`, house, `"${event}"`, 'final', `${finalScore}`, finalScore]);
        }
    }
    if (isCurveball) {
        // Shuffle row order to punish hardcoded index assumptions
        for (let i = rows.length - 1; i > 0; i--) {
            const j = randInt(0, i);
            [rows[i], rows[j]] = [rows[j], rows[i]];
        }
    }
    writeCsv(`a3-pack-beta${suffix}`, ['record_id', 'student_name', 'phone_ext', 'medical_note', 'house', 'event_name', 'event_stage', 'reported_index', 'verified_score'], rows);
}

/* PACK GAMMA — Hostel & Zonal Canteen Provisioning
 * Traps: (1) 1,320 rows (2,100 in curveball) with Hostel Block D placed mostly after row 1,000,
 *        (2) Area-lies distortion (Admin Grounds 48,000 sqm / 110 pop vs Hostel Block D 2,200 sqm / 1,480 pop),
 *        (3) Semantic conflict in order_status (settled vs cancelled vs pending_reversal).
 */
{
    const total = isCurveball ? 2100 : 1320;
    const zonesEarly = [
        { name: 'Admin Grounds', area: 48000, pop: 110 },
        { name: 'Academic Block', area: 26000, pop: 620 },
        { name: 'Sports Complex', area: 34000, pop: 240 }
    ];
    const hostelD = { name: 'Hostel Block D', area: 2200, pop: 1480 };
    const slots = ['breakfast', 'lunch', 'snacks', 'dinner'];
    const rows = [];
    let dt = startDate(2026, 10, 1);

    for (let i = 0; i < total; i++) {
        // First 1,000 rows barely contain Hostel Block D; rows > 1,000 are overwhelmingly Hostel Block D
        const useHostelD = i < 1000 ? (i % 25 === 0) : (R() < (isCurveball ? 0.92 : 0.88));
        const z = useHostelD ? hostelD : zonesEarly[i % zonesEarly.length];
        const statusRoll = R();
        let status = 'settled';
        if (isCurveball && z.name === 'Sports Complex') {
            status = statusRoll < 0.45 ? 'cancelled' : (statusRoll < 0.62 ? 'pending_reversal' : 'settled');
        } else {
            status = statusRoll < 0.18 ? 'cancelled' : (statusRoll < 0.32 ? 'pending_reversal' : 'settled');
        }
        const amt = z.name === 'Hostel Block D' ? randInt(65, 220) : randInt(45, 160);
        const txDate = iso(addDays(dt, i % 30));
        rows.push([`TX-${10001 + i}`, txDate, `"${z.name}"`, z.area, z.pop, pick(slots), status, amt]);
    }
    writeCsv(`a3-pack-gamma${suffix}`, ['tx_id', 'date', 'zone_name', 'zone_area_sqm', 'zone_population', 'meal_slot', 'order_status', 'amount_inr'], rows);
}

/* PACK DELTA — Student Academic Risk & Lab Telemetry Alerts
 * Traps: (1) Alarm storm: ~91% info heartbeat noise hiding ~3% critical escalations,
 *        (2) ML risk_prob needs top_factor_1/2 explainability instead of raw score alone,
 *        (3) Color-only severity bait (info / watch / critical).
 */
{
    const total = isCurveball ? 550 : 320;
    const cohorts = ['Cohort-A', 'Cohort-B', 'Cohort-C'];
    const factors = ['attendance_drop', 'missed_3_labs', 'late_submissions', 'quiz_variance', 'portal_inactivity'];
    const rows = [];
    let ts = Date.UTC(2026, 10, 1, 8, 0, 0);

    for (let i = 0; i < total; i++) {
        const isCritical = isCurveball ? (i % 38 === 0 || (i > 480 && i % 12 === 0)) : (i % 36 === 0);
        const isWatch = !isCritical && (i % 16 === 0);
        const sev = isCritical ? 'critical' : (isWatch ? 'watch' : 'info');
        const evt = isCritical
            ? pick(['lab_safety_miss', 'attendance_cliff', 'consecutive_fail_flag'])
            : (isWatch ? pick(['late_lab_upload', 'quiz_dip']) : pick(['portal_ping', 'session_idle', 'cache_sync']));
        const cohort = (isCurveball && isCritical && i > 450) ? 'Cohort-C' : cohorts[i % cohorts.length];
        const prob = isCritical ? round(rand(0.76, 0.95), 2) : (isWatch ? round(rand(0.45, 0.72), 2) : round(rand(0.05, 0.34), 2));
        const f1 = isCritical ? pick(['attendance_drop', 'missed_3_labs']) : pick(factors);
        let f2 = pick(factors);
        if (f2 === f1) f2 = 'quiz_variance';
        const w1 = round(rand(0.45, 0.72), 2);
        const w2 = round(1 - w1 - rand(0.05, 0.2), 2);
        const stamp = new Date(ts + i * 180000).toISOString().slice(0, 19) + 'Z';
        rows.push([`ALT-${2001 + i}`, stamp, cohort, `STU-${101 + (i % 45)}`, sev, evt, prob, f1, w1, f2, Math.max(0.05, w2)]);
    }
    if (isCurveball) rows.reverse();
    writeCsv(`a3-pack-delta${suffix}`, ['alert_id', 'timestamp', 'cohort', 'student_ref', 'severity', 'event_type', 'risk_prob', 'top_factor_1', 'factor_1_weight', 'top_factor_2', 'factor_2_weight'], rows);
}

if (!isCurveball) {
    const readme = `# Assignment 3 — Mystery Multi-Trap Dataset Packs

Generated deterministically by \`scripts/generate-a3-datasets.js\` (seed \`20261113\`).
**No trap hints are listed here by design** — inspecting the raw CSV and diagnosing what naive AI gets wrong is Phase 1 of Assignment 3.

| Pack | File | Rows | Columns |
| :--- | :--- | ---: | :--- |
| **Alpha** | \`a3-pack-alpha.csv\` | ${MANIFEST[0].rows} | \`date, node_id, forecast_kwh, band_low_kwh, band_high_kwh, actual_kwh, inverter_state, ambient_temp, temp_unit\` |
| **Beta** | \`a3-pack-beta.csv\` | ${MANIFEST[1].rows} | \`record_id, student_name, phone_ext, medical_note, house, event_name, event_stage, reported_index, verified_score\` |
| **Gamma** | \`a3-pack-gamma.csv\` | ${MANIFEST[2].rows} | \`tx_id, date, zone_name, zone_area_sqm, zone_population, meal_slot, order_status, amount_inr\` |
| **Delta** | \`a3-pack-delta.csv\` | ${MANIFEST[3].rows} | \`alert_id, timestamp, cohort, student_ref, severity, event_type, risk_prob, top_factor_1, factor_1_weight, top_factor_2, factor_2_weight\` |

## Trainer Only: Generating Live Curveball Files (20 Nov 2026)

Run locally before Presentation Day (writes into gitignored \`var/a3-curveballs/\` so students cannot preview them on GitHub):

\`\`\`powershell
node scripts/generate-a3-datasets.js --curveball 20261120
\`\`\`
`;
    fs.writeFileSync(path.join(OUT, 'README.md'), readme, 'utf8');
    console.log('  Written assignments/data/README.md');
}
