/*
 * Synthetic dataset generator for the 20 dashboard challenges.
 * Deterministic (seeded PRNG) so re-running produces identical CSVs.
 * Usage: node scripts/generate-datasets.js   (writes to datasets/)
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'datasets');
fs.mkdirSync(OUT, { recursive: true });

// ---- seeded PRNG (mulberry32) ----
function rng(seed) {
    let a = seed >>> 0;
    return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}
const R = rng(20261029); // fixed seed: 29 Oct 2026
const rand = (lo, hi) => lo + R() * (hi - lo);
const randInt = (lo, hi) => Math.floor(rand(lo, hi + 1));
const pick = (arr) => arr[randInt(0, arr.length - 1)];
const round = (v, d = 1) => Math.round(v * 10 ** d) / 10 ** d;
const iso = (d) => d.toISOString().slice(0, 10);

function write(name, header, rows) {
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n') + '\n';
    fs.writeFileSync(path.join(OUT, name), csv, 'utf8');
    console.log(`  ${name}  (${rows.length} rows, ${Math.round(csv.length / 1024)} KB)`);
}

// ---- date helpers ----
const startDate = (y, m, d = 1) => new Date(Date.UTC(y, m - 1, d));
function addMonths(dt, n) { return new Date(Date.UTC(dt.getUTCFullYear(), dt.getUTCMonth() + n, 1)); }
function addDays(dt, n) { return new Date(dt.getTime() + n * 86400000); }

const FIRST = ['Aarav','Vivaan','Aditya','Vihaan','Arjun','Sai','Reyansh','Krishna','Ishaan','Rohan','Ananya','Diya','Aadhya','Saanvi','Myra','Anika','Navya','Kiara','Pari','Riya','Kabir','Advait','Dhruv','Yash','Meera','Tara','Kavya','Ira','Zara','Aisha'];
const LAST = ['Sharma','Verma','Gupta','Singh','Mehta','Patel','Reddy','Nair','Iyer','Chopra','Malhotra','Banerjee','Das','Kulkarni','Joshi'];
const name = () => `${pick(FIRST)} ${pick(LAST)}`;

console.log('Generating synthetic datasets -> datasets/');

/* 1 — The Hero Axis: monthly attendance 85-96% (truncated-axis bait) */
{
    const rows = [];
    let dt = startDate(2024, 11);
    for (let i = 0; i < 24; i++) {
        const pct = round(85.5 + i * 0.28 + rand(-1.6, 1.6), 1);
        rows.push([iso(dt), Math.min(96.5, pct)]);
        dt = addMonths(dt, 1);
    }
    write('challenge-01-attendance-hero-axis.csv', ['month', 'attendance_pct'], rows);
}

/* 2 — Red Means Go?: equipment status board */
{
    const eq = ['Optical bench','Digital microscope','Vernier calipers (set)','Oscilloscope','Centrifuge','Bunsen burner bank','pH meter','Spectrophotometer','Microscope camera','Hot-air oven','Analytical balance','Anemometer kit','Tesla coil','Water bath','Ripple tank','Dissection set'];
    const statuses = ['in_use', 'faulty', 'available'];
    const rows = eq.map((e, i) => [
        `LAB-EQP-${String(i + 1).padStart(3, '0')}`, `"${e}"`, `Lab ${pick(['A','B','C'])}`, pick(statuses), iso(addDays(startDate(2026, 10), randInt(0, 20)))
    ]);
    // ensure at least 3 faulty rows (the red-vs-green trap needs company)
    for (let i = 0; i < 3; i++) rows[i * 5][3] = 'faulty';
    write('challenge-02-lab-status.csv', ['equipment_id', 'equipment_name', 'location', 'status', 'checked_at'], rows);
}

/* 3 — The Missing Tuesday: step counts with a sensor outage */
{
    const rows = [];
    let dt = startDate(2026, 9, 15);
    for (let i = 0; i < 30; i++) {
        const outage = (i === 11 || i === 12); // Tue + Wed of week 3
        rows.push([iso(dt), outage ? '' : randInt(3200, 12800), outage ? 'outage' : 'ok']);
        dt = addDays(dt, 1);
    }
    write('challenge-03-missing-tuesday.csv', ['date', 'steps', 'sensor_status'], rows);
}

/* 4 — Pie Overload: 14-slice canteen budget */
{
    const cats = ['Stationery','Sports equipment','Canteen food supplies','Lab reagents','Library books','Bus maintenance','Electricity bill','Water supply','Cleaning & sanitation','Event decorations','Prizes & certificates','Teacher training','IT software licences','Contingency fund'];
    const rows = cats.map(c => [`"${c}"`, randInt(18, 420) * 1000]);
    write('challenge-04-canteen-budget.csv', ['category', 'amount_inr'], rows);
}

/* 5 — The Zoomed Breakout: 3 years of flat chess-club membership */
{
    const rows = [];
    let dt = startDate(2023, 11, 6);
    for (let i = 0; i < 156; i++) {
        const late = i >= 153; // last 3 weeks
        const base = late ? [46, 51, 58][i - 153] : 40;
        rows.push([iso(dt), base + randInt(-3, 3)]);
        dt = addDays(dt, 7);
    }
    write('challenge-05-chess-membership.csv', ['week_starting', 'active_members'], rows);
}

/* 6 — Which Average?: skewed class marks */
{
    const rows = [];
    const marks = [];
    for (let i = 0; i < 28; i++) marks.push(randInt(55, 70));   // bulk: median sits here (~64)
    for (let i = 0; i < 6; i++) marks.push(randInt(74, 84));    // mid tail
    marks.push(94, 95, 98, 99);                                  // four high scores pull the mean
    // deterministic shuffle
    for (let i = marks.length - 1; i > 0; i--) { const j = randInt(0, i); [marks[i], marks[j]] = [marks[j], marks[i]]; }
    marks.forEach((m, i) => rows.push([1001 + i, `"${name()}"`, pick(['A','B']), m]));
    write('challenge-06-class-marks.csv', ['roll_no', 'student_name', 'section', 'marks'], rows);
}

/* 7 — Double-Ruler Drama: on-time % vs diesel cost, inverse-linked */
{
    const rows = [];
    let dt = startDate(2024, 11);
    for (let i = 0; i < 24; i++) {
        const ontime = round(93 - i * 0.45 + rand(-1.5, 1.5), 1);          // drifting down
        const diesel = round(180 + i * 5.2 + rand(-8, 8), 1);              // drifting up
        rows.push([iso(dt), ontime, diesel]);
        dt = addMonths(dt, 1);
    }
    write('challenge-07-transport-dual-axis.csv', ['month', 'bus_ontime_pct', 'diesel_cost_inr_thousands'], rows);
}

/* 8 — Silent Row Loss: 1200-row recycling tally (truncates at 1000 in lazy tools) */
{
    const blocks = ['A','B','C','D','E','F'];
    const rows = [];
    let dt = startDate(2026, 8, 1);
    for (let i = 0; i < 1200; i++) {
        rows.push([i + 1, iso(addDays(dt, Math.floor(i / 22))), pick(blocks), round(rand(0.4, 9.8), 2), randInt(1, 6)]);
    }
    write('challenge-08-recycling-rows.csv', ['record_id', 'collection_date', 'block', 'weight_kg', 'students_involved'], rows);
}

/* 9 — Hue-Only Heat Map: room usage grid, 1 blue intensity */
{
    const rooms = ['R-101','R-102','R-103','R-201','R-202','R-203','Lab-1','Lab-2'];
    const rows = [];
    for (const room of rooms) {
        for (let h = 9; h <= 20; h++) {
            const lvl = randInt(0, 3);
            rows.push([room, `${String(h).padStart(2, '0')}:00`, lvl, lvl === 0 ? 0 : lvl * randInt(6, 9)]);
        }
    }
    write('challenge-09-room-usage.csv', ['room', 'hour_slot', 'occupancy_level_0_to_3', 'approx_occupants'], rows);
}

/* 10 — The Flicker Feed: per-second canteen queue pings */
{
    const rows = [];
    let q = 14;
    const t0 = startDate(2026, 10, 22).getTime() + 12 * 3600000; // 12:00:00
    for (let s = 0; s < 900; s++) {
        q = Math.max(3, Math.min(46, q + randInt(-2, 2)));
        const t = new Date(t0 + s * 1000).toISOString().slice(11, 19);
        rows.push([`${iso(startDate(2026, 10, 22))}T${t}`, 'CANTEEN-MAIN', q]);
    }
    write('challenge-10-canteen-queue.csv', ['timestamp', 'counter_id', 'queue_length'], rows);
}

/* 11 — Mobile Mashup: exam results, six subjects + demographics */
{
    const rows = [];
    for (let i = 0; i < 60; i++) {
        rows.push([1201 + i, `"${name()}"`, pick(['A','B','C','D']), pick(['F','M']), randInt(38, 99), randInt(35, 98), randInt(40, 97), randInt(33, 96), randInt(42, 99), randInt(30, 95)]);
    }
    write('challenge-11-exam-results.csv', ['roll_no', 'student_name', 'section', 'gender', 'maths', 'science', 'english', 'social_studies', 'hindi', 'computer'], rows);
}

/* 12 — Hover-Only Facts: energy readings with NO unit column (units = kWh) */
{
    const rows = [];
    let dt = startDate(2024, 11);
    for (let i = 0; i < 24; i++) {
        rows.push([iso(dt), round(rand(8200, 15400), 0)]);
        dt = addMonths(dt, 1);
    }
    write('challenge-12-energy-readings.csv', ['month', 'consumption'], rows);
}

/* 13 — Two Vote Counts: two sheets, different vote weights */
{
    const projects = ['P-01 Solar still','P-02 Wind turbine','P-03 Soil pH garden','P-04 Rocket launch','P-05 Weather station'];
    const a = [], b = [];
    let vid = 1;
    for (let s = 1; s <= 25; s++) {
        const sid = `STU-${String(s).padStart(3, '0')}`;
        for (let k = 0; k < 3; k++) a.push([vid++, sid, pick(projects)]);        // sheet A: 3 votes each
        b.push([vid++, sid, pick(projects)]);                                     // sheet B: 1 vote each
    }
    write('challenge-13-voting-sheet-a.csv', ['vote_id', 'student_id', 'project'], a);
    write('challenge-13-voting-sheet-b.csv', ['vote_id', 'student_id', 'project'], b);
}

/* 14 — Names on the Big Screen: fitness test with real-looking PII */
{
    const rows = [];
    for (let i = 0; i < 50; i++) {
        const run = round(rand(142, 236), 1), jump = round(rand(1.6, 3.9), 2), shot = round(rand(3.2, 9.4), 2);
        rows.push([1301 + i, `"${name()}"`, pick(['A','B','C','D']), pick(['F','M']), randInt(14, 17), run, jump, shot, round(run * 0.4 + jump * 100 * 0.3 + shot * 10 * 0.3, 1)]);
    }
    rows.sort((x, y) => y[8] - x[8]).forEach((r, i) => r.push('RANK-' + String(i + 1).padStart(2, '0')));
    write('challenge-14-fitness-test.csv', ['roll_no', 'student_name', 'section', 'gender', 'age', 'run_800m_sec', 'long_jump_m', 'shot_put_m', 'composite_score', 'rank'], rows);
}

/* 15 — Cluster Mirage: 2D activity map with two engineered blobs */
{
    const rows = [];
    for (let i = 0; i < 60; i++) rows.push([`STU-${String(i + 1).padStart(3, '0')}`, round(rand(0.8, 3.2), 1), round(rand(7.5, 14.5), 1)]);   // blob 1: low study, high sports
    for (let i = 60; i < 120; i++) rows.push([`STU-${String(i + 1).padStart(3, '0')}`, round(rand(9.5, 15.5), 1), round(rand(0.6, 3.8), 1)]); // blob 2: high study, low sports
    for (let i = 120; i < 126; i++) rows.push([`STU-${String(i + 1).padStart(3, '0')}`, round(rand(4, 9), 1), round(rand(4, 8), 1)]);        // bridge noise
    write('challenge-15-activity-map.csv', ['student_id', 'study_hours_per_week', 'sports_hours_per_week'], rows);
}

/* 16 — Alarm Storm: ~20 alerts/min, 3 minutes, only 3 genuinely critical */
{
    const zones = ['Gate','Track','Stand-block A','Stand-block B','First-aid','Parking'];
    const sev = ['info','info','info','info','info','warning','warning','critical'];
    const msgs = { info: 'SENSOR_PING,QUEUE_LENGTH,CROWD_DENSITY_OK,BATTERY_OK', warning: 'THRESHOLD_NEAR,CROWD_BUILDUP,TEMP_HIGH', critical: 'MEDICAL_ASSIST,GATE_CRUSH_RISK,FIRE_EXIT_BLOCKED' };
    const rows = [];
    const t0 = startDate(2026, 10, 18).getTime() + 9 * 3600000; // 09:00:00 sports day
    for (let s = 0; s < 180; s += 3) {
        const sevHere = pick(sev);
        rows.push([new Date(t0 + s * 1000).toISOString().slice(0, 19), pick(zones), sevHere, pick(msgs[sevHere].split(','))]);
    }
    // plant 3 true criticals among the noise
    const crit = [[12, 'First-aid', 'critical', 'MEDICAL_ASSIST'], [75, 'Gate', 'critical', 'GATE_CRUSH_RISK'], [150, 'Stand-block B', 'critical', 'FIRE_EXIT_BLOCKED']];
    crit.forEach(([s, z, sv, m]) => rows[Math.floor(s / 3)] = [new Date(t0 + s * 1000).toISOString().slice(0, 19), z, sv, m]);
    write('challenge-16-alarm-log.csv', ['timestamp', 'zone', 'severity', 'message_code'], rows);
}

/* 17 — The Sarcasm Meter: feedback with sarcastic comments scored "positive" */
{
    const fb = [
        ['"Oh great, another drill 😍"', 0.94, 'positive'],
        ['"Loved the tug of war, amazing energy"', 0.91, 'positive'],
        ['"Wow another fire drill, exactly what my day needed 💕"', 0.89, 'positive'],
        ['"Food stalls were genuinely good this year"', 0.86, 'positive'],
        ['"Sure, because standing 40 min in the sun is my hobby"', 0.88, 'positive'],
        ['"Nice organization overall, timing was tight"', 0.72, 'positive'],
        ['"What a lovely way to waste a period 😐"', 0.81, 'positive'],
        ['"Races were well managed"', 0.77, 'positive'],
        ['"Mediocre arrangements, expected better"', 0.21, 'negative'],
        ['"Sound system was unusable in block B"', 0.14, 'negative'],
        ['"Too crowded, left after an hour"', 0.29, 'negative'],
        ['"Prize distribution took forever"', 0.33, 'negative'],
        ['"Decent event, could be better"', 0.52, 'neutral'],
        ['"It was fine I guess"', 0.48, 'neutral'],
        ['"Some events were fun, some not"', 0.55, 'neutral'],
        ['"Perfect, no notes 👏"', 0.96, 'positive'],
        ['"Great, another year of the same three events"', 0.83, 'positive'],
        ['"Honestly had a good time"', 0.80, 'positive'],
        ['"Not bad, not good"', 0.46, 'neutral'],
        ['"Waste of time and fees"', 0.09, 'negative'],
    ];
    const rows = fb.map(([c, s, l], i) => [`FB-${String(i + 1).padStart(3, '0')}`, c, s, l]);
    write('challenge-17-feedback-sentiment.csv', ['feedback_id', 'comment', 'sentiment_score_0_to_1', 'label'], rows);
}

/* 18 — Phantom Spike: per-second GPS feed + daily-log averages in ONE file */
{
    const rows = [];
    const t0 = startDate(2026, 10, 20).getTime() + 7 * 3600000 + 45 * 60000; // 07:45:00
    for (const bus of ['BUS-07', 'BUS-12']) {
        let v = 34;
        for (let s = 0; s < 150; s++) {
            v = Math.max(0, Math.min(62, v + randInt(-4, 4)));
            rows.push([new Date(t0 + s * 1000).toISOString().slice(0, 19), bus, 'gps_live', v]);
        }
    }
    // daily-log rows: one per bus, whole-trip average, stamped at day level
    rows.push([iso(startDate(2026, 10, 20)), 'BUS-07', 'daily_log', 31.4]);
    rows.push([iso(startDate(2026, 10, 20)), 'BUS-12', 'daily_log', 28.9]);
    rows.sort((a, b) => a[0] < b[0] ? -1 : 1);
    write('challenge-18-bus-gps.csv', ['timestamp', 'vehicle_id', 'source', 'speed_kph'], rows);
}

/* 19 — Broken Inheritance: year_label hardcoded "2024" while dates span 2023-2026 */
{
    const events = ['Annual Sports Day','Science Exhibition','Inter-house Quiz','Founder’s Day','Spring Fete','Literary Week','Art Showcase','Math Olympiad'];
    const cats = ['Sprint','Relay','Exhibit','Quiz','Debate','Art','Individual','Team'];
    const rows = [];
    for (let i = 0; i < 40; i++) {
        const yr = 2023 + (i % 4);
        rows.push(['2024', iso(startDate(yr, randInt(1, 12), randInt(1, 28))), pick(events), pick(cats), pick(FIRST), randInt(1, 4)]);
    }
    write('challenge-19-prize-data.csv', ['year_label', 'event_date', 'event_name', 'category', 'recipient_first_name', 'position'], rows);
}

/* 20 — Export Amnesia: admissions detail that only makes sense row-by-row */
{
    const programs = ['B.Sc Data Science','B.Com','B.A English','BBA','BCA'];
    const quotas = ['General','EWS','Sports','SC/ST'];
    const remarks = ['Docs pending — TC not submitted','Verified at desk 2; fee receipt missing','Lateral entry; equivalence approved','Both mark sheets verified','Name mismatch with 12th certificate, affidavit needed','Sports quota: state-level certificate verified','Duplicate application — merged manually','Entrance score disputed, re-checked by HOD','Verified; scholarship form attached','Parent requested morning batch'];
    const rows = [];
    let dt = startDate(2026, 6, 1);
    for (let i = 0; i < 80; i++) {
        const docsOk = R() > 0.25;
        rows.push([10001 + i, iso(dt), pick(programs), pick(quotas), randInt(42, 98), randInt(45, 95), docsOk ? 'yes' : 'no', docsOk ? pick(['confirmed','confirmed','waitlist']) : pick(['pending','rejected','pending']), pick(remarks)]);
        dt = addDays(dt, randInt(0, 2));
    }
    write('challenge-20-admissions.csv', ['application_id', 'received_date', 'program', 'quota', 'entrance_score', 'interview_score', 'docs_verified', 'status', 'counselor_remarks'], rows);
}

console.log('Done. 21 CSV files written to datasets/');
