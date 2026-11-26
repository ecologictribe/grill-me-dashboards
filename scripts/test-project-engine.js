/**
 * TEST-PROJECT-ENGINE.JS
 * Unit and Integration Test Suite for Capstone Project Work Engine
 */

const engine = require('../gate-challenge/assets/project-engine.js');

let failures = 0;
function assert(desc, condition) {
    if (!condition) {
        console.error(`FAIL: ${desc}`);
        failures++;
    } else {
        console.log(`PASS: ${desc}`);
    }
}

console.log('--- RUNNING PROJECT ENGINE TESTS ---');

// 1. Seed & Hashing
const seed1 = engine.deriveSeed('FS-2026-8812');
const seed2 = engine.deriveSeed('FS-2026-8812');
const seedOther = engine.deriveSeed('CS-2026-4401');
assert('Seed derivation is deterministic', seed1 === seed2);
assert('Different IDs produce different seeds', seed1 !== seedOther);

// 2. Dataset Generation Determinism
const ds1 = engine.generateDataset('FS-2026-8812', 'forensic', false);
const ds2 = engine.generateDataset('FS-2026-8812', 'forensic', false);
assert('Dataset row count is deterministic', ds1.rowCount === ds2.rowCount);
assert('Dataset content is identical across identical seeds', JSON.stringify(ds1.data) === JSON.stringify(ds2.data));

// 3. Domain Traps Verification
// Forensic
const forensicHasNullStrings = ds1.data.some(r => r.relinquishing_auth === 'NA' || r.relinquishing_auth === '' || r.relinquishing_auth === 'unknown');
const forensicHasBimodalTail = ds1.data.some(r => r.actual_turnaround > 30);
assert('Forensic dataset contains injected null strings', forensicHasNullStrings);
assert('Forensic dataset contains statutory turnaround tail breaches (>30 days)', forensicHasBimodalTail);

// CS
const csData = engine.generateDataset('CS-2026-4401', 'cs', false);
const csHasSpikes = csData.data.some(r => r.latency_ms > 2000);
const csAlarmStorm = csData.data.filter(r => r.http_status === 200).length / csData.rowCount;
assert('CS dataset contains p99 extreme latency spikes (>2000ms)', csHasSpikes);
assert('CS dataset features alarm storm distribution (>75% heartbeats)', csAlarmStorm > 0.75);

// Nutrition
const nutData = engine.generateDataset('NUT-2026-309', 'nutrition', false);
const nutHasZeroInflation = nutData.data.some(r => r.vitamin_c_mg === 0.0);
const nutHasUnitDiscordance = nutData.data.some(r => r.serving_unit === 'total-recipe');
assert('Nutrition dataset contains zero-inflation in Vitamin C', nutHasZeroInflation);
assert('Nutrition dataset contains unit discordance', nutHasUnitDiscordance);

// 4. Stable Invariants & Graph Theory
const stats = engine.computeStableStats(ds1.data);
assert('computeStableStats returns numeric rows and sum', stats.rows > 0 && typeof stats.numericSum === 'number');

const graph = engine.computeGraphMetrics(ds1.data, 'forensic');
assert('Graph extraction finds nodes and edges', graph.nodeCount > 0 && graph.edgeCount > 0);
assert('Graph metrics identify a top hub node', graph.topHub && graph.topHub.degree > 0);

// 5. Dynamic Probe
const probe = engine.computeProbeQuestion(ds1.seed, 'forensic', ds1.data);
assert('Dynamic probe generated with probeId and expectedAnswer', probe.probeId && typeof probe.expectedAnswer !== 'undefined');

// 6. Full End-to-End Submission Verification (Positive Match)
const cleanCode = `
function cleanData(data) {
    return data.map(function(row) {
        var r = Object.assign({}, row);
        if (r.relinquishing_auth === 'NA' || r.relinquishing_auth === 'unknown' || r.relinquishing_auth === '') {
            r.relinquishing_auth = 'UNRECORDED_OFFICER';
        }
        return r;
    });
}
`;

// Compute what cleanData produces
const cleaner = new Function('rawData', cleanCode + '\nreturn cleanData(rawData);');
const cleaned = cleaner(JSON.parse(JSON.stringify(ds1.data)));
const cleanedStats = engine.computeStableStats(cleaned);
const probeQ = engine.computeProbeQuestion(ds1.seed, 'forensic', cleaned);

const gate1 = {
    queries: ['SELECT * FROM evidence WHERE actual_turnaround > 30;', 'SELECT count(*) FROM evidence WHERE relinquishing_auth IS NULL OR relinquishing_auth = "NA";'],
    grillAnswers: [
        'Null strings mask evidence chain gaps and delete critical custody history.',
        'Mean turnaround hides tail cases exceeding 30-day statutory deadline.',
        'Missing officers fracture suspect network into disconnected graph clusters.',
        'Procedural chain gaps risk evidence dismissal under statutory audit rules.',
        'Explicit null-banding preserves data records without statistical distortion.',
        'Linked brushing across multi-tab hierarchy exposes tail cases directly.'
    ]
};

const gate2 = {
    cleaningCode: cleanCode,
    stableStats: cleanedStats,
    justifications: [
        'Replaced string nulls with explicit UNRECORDED_OFFICER tags.',
        'Preserved 100% of rows; zero deletions occurred.',
        'Turnaround outliers are retained and flagged for statutory breaches.',
        'Pure deterministic function ensures identical invariants across runs.',
        'Audited LLM output to prevent fabrication of fictional badge numbers.'
    ],
    justification: 'Harmonized missing officer tags to explicit UNRECORDED_OFFICER to preserve custody integrity without row loss.'
};

const gate3 = {
    chartConfigs: { multiTab: true, crossBrushing: true, graphView: true },
    comparativeAnalysis: 'In raw dashboard, unrecorded officers were dropped, biasing network degree centrality by 35%. Cleaned dashboard restored complete chain.',
    probeId: probeQ.probeId,
    probeAnswer: probeQ.expectedAnswer
};

const fps = engine.computeFingerprints(ds1.seed, gate1, gate2, gate3);
gate1.fingerprint = fps.fp1;
gate2.fingerprint = fps.fp2;
gate3.fingerprint = fps.fp3;

const mockSubmission = {
    studentName: 'Alex Chen',
    studentId: 'FS-2026-8812',
    domain: 'forensic',
    seed: ds1.seed,
    timestamp: new Date().toISOString(),
    gate1: gate1,
    gate2: gate2,
    gate3: gate3,
    finalPassCode: fps.finalPassCode
};

const verifyResult = engine.verifySubmission(mockSubmission);
assert('Automated verifier produces MATCH on valid submission', verifyResult.isValid === true);

// 7. Verification Failure Detection (Tampering Detection)
const tamperedSubmission = JSON.parse(JSON.stringify(mockSubmission));
tamperedSubmission.gate3.probeAnswer = 999999; // Corrupt the probe answer
const failResult = engine.verifySubmission(tamperedSubmission);
assert('Automated verifier catches tampered probe and flags MISMATCH', failResult.isValid === false && failResult.failingGate === 'gate3');

if (failures > 0) {
    console.error(`\nFAILED: ${failures} check(s) failed.`);
    process.exit(1);
} else {
    console.log(`\nALL PROJECT ENGINE TESTS PASSED!`);
}
