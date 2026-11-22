/**
 * PROJECT-ENGINE.JS
 * Core Cryptographic, PRNG, Synthetic Domain Dataset Generator & Verification Engine
 * 
 * Spec: PROJ-SPEC-2026-GATE (PROJECT-WORK-SPEC.md) & PROJ-SPEC-2026-DOMAINS (DOMAIN-SCOPING.md)
 * Course: Data Visualization Architecture & Engineering (grill_me_dashboard)
 * Lead Trainer / Author: Puneet Arora (Aplly.xyz)
 * 
 * Dual Environment: Node.js (CommonJS) & Browser (window.ProjectEngine)
 */

(function (root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.ProjectEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function () {
    'use strict';

    var SALT = 'gatechallenge-2026-v2';

    // 1. Pure Synchronous SHA-256
    function sha256(str) {
        var ascii = unescape(encodeURIComponent(str || ''));
        function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
        var mathPow = Math.pow, maxWord = mathPow(2, 32), i, j, result = '', words = [], asciiBitLength = ascii.length * 8;
        var hash = [], k = [], primeCounter = 0, isComposite = {};
        for (var candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
                hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }
        ascii += '\x80';
        while (ascii.length % 64 - 56) ascii += '\x00';
        for (i = 0; i < ascii.length; i++) { j = ascii.charCodeAt(i); words[i >> 2] |= j << ((3 - i) % 4) * 8; }
        words[words.length] = ((asciiBitLength / maxWord) | 0);
        words[words.length] = (asciiBitLength);
        for (j = 0; j < words.length;) {
            var w = words.slice(j, j += 16), oldHash = hash; hash = hash.slice(0, 8);
            for (i = 0; i < 64; i++) {
                var w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
                var temp1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i]
                    + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
                var temp2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
                hash = [(temp1 + temp2) | 0].concat(hash); hash[4] = (hash[4] + temp1) | 0;
            }
            for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
        }
        for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; result += ((b < 16) ? '0' : '') + b.toString(16); }
        return result;
    }

    // 2. Deterministic Seed Derivation
    function deriveSeed(studentId, customSalt) {
        var cleanId = String(studentId || '').trim();
        return sha256(cleanId + (customSalt || SALT));
    }

    // 3. Mulberry32 PRNG
    function createPRNG(seedHex) {
        var seedInt = parseInt((seedHex || '00000000').slice(0, 8), 16) >>> 0;
        var s = seedInt;
        return {
            next: function () {
                var t = s += 0x6D2B79F5;
                t = Math.imul(t ^ (t >>> 15), t | 1);
                t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
                return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
            },
            nextInt: function (min, max) {
                return Math.floor(this.next() * (max - min + 1)) + min;
            },
            choice: function (arr) {
                return arr[Math.floor(this.next() * arr.length)];
            }
        };
    }

    // 4. Domain Dataset Generator
    function generateDataset(studentId, domain, isCurveball) {
        domain = String(domain || 'forensic').toLowerCase();
        var seed = deriveSeed(studentId, (isCurveball ? SALT + '-curveball' : SALT));
        var rng = createPRNG(seed);

        var rowCount = rng.nextInt(85, 115);
        var rows = [];

        if (domain === 'forensic') {
            var evidenceTypes = ['Ballistics', 'Biological/DNA', 'Digital Media', 'Narcotics', 'Latent Fingerprints'];
            var officers = ['Det. Miller #402', 'Inv. Kowalski #118', 'Sgt. Sterling #890', 'Tech. Vance #224', 'Capt. Reyes #004', 'Det. Zhao #512'];
            var precincts = ['District-North-01', 'District-South-04', 'District-East-02', 'District-West-09', 'Central-Forensic-Vault'];
            var nullEquivalents = ['', 'NA', 'unknown', '-', 'PENDING'];

            for (var i = 0; i < rowCount; i++) {
                var caseNum = 1000 + (i % 24); // generates repeat case_ids for duplicates
                var isDupConflict = (i > 0 && i % 17 === 0);
                var caseId = 'CASE-CR-' + (isDupConflict ? (1000 + ((i - 1) % 24)) : caseNum);
                var evType = rng.choice(evidenceTypes);
                
                // Trap A1: Null strings in relinquishing_auth
                var relinquishing;
                var randNull = rng.next();
                if (randNull < 0.14) {
                    relinquishing = rng.choice(nullEquivalents);
                } else {
                    relinquishing = rng.choice(officers);
                }

                var receiving = rng.choice(officers);
                while (receiving === relinquishing) {
                    receiving = rng.choice(officers);
                }

                // Date formatting trap (mixed ISO vs DD/MM/YYYY)
                var d = new Date(Date.UTC(2026, 9, 1 + (i % 30), rng.nextInt(8, 20), rng.nextInt(0, 59)));
                var timestamp;
                if (i % 5 === 0) {
                    var pad = function(n) { return n < 10 ? '0' + n : n; };
                    timestamp = pad(d.getUTCDate()) + '/' + pad(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear() + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
                } else {
                    timestamp = d.toISOString();
                }

                // Trap: Turnaround tail breach (bimodal distribution)
                var turnaround;
                if (rng.next() < 0.18) {
                    // Critical statutory breach: 35 to 88 days
                    turnaround = parseFloat((rng.next() * 53 + 35).toFixed(1));
                } else {
                    // Normal turnaround: 4 to 26 days
                    turnaround = parseFloat((rng.next() * 22 + 4).toFixed(1));
                }

                var precinct = rng.choice(precincts);
                var seal = rng.next() < 0.88 ? 'YES' : (rng.next() < 0.5 ? 'NO' : 'UNCHECKED');
                var gapFlag = (relinquishing === '' || relinquishing === 'NA' || seal === 'NO') ? 1 : 0;

                rows.push({
                    transfer_id: 'TXF-2026-' + (9000 + i),
                    case_id: caseId,
                    evidence_type: evType,
                    relinquishing_auth: relinquishing,
                    receiving_auth: receiving,
                    transfer_timestamp: timestamp,
                    statutory_deadline: 30,
                    actual_turnaround: turnaround,
                    custody_seal_intact: seal,
                    jurisdiction_zone: precinct,
                    chain_gap_flag: gapFlag
                });
            }
        } else if (domain === 'cs' || domain === 'computer_science') {
            var callers = ['api-gateway', 'auth-service', 'checkout-web', 'mobile-backend', 'inventory-worker', 'billing-agent'];
            var targets = ['user-db-pool', 'payment-gateway', 'redis-cache-cluster', 'order-ledger', 'audit-logger', 'auth-service'];
            var routes = [
                '/v1/auth/token', '/v2/checkout/process', '/api/users/profile', '/v1/orders/create',
                '/healthz', '/v1/inventory/reserve', '/v2/search/products', '/api/billing/charge'
            ];
            // Add dynamic high-cardinality routes
            for (var r = 0; r < 20; r++) routes.push('/api/dynamic/route_' + r + '/trace');

            for (var j = 0; j < rowCount; j++) {
                var caller = rng.choice(callers);
                var target = rng.choice(targets);
                var route = rng.choice(routes);
                var isAlarmStorm = rng.next() < 0.88; // 88% info heartbeats
                var status = isAlarmStorm ? 200 : rng.choice([401, 404, 500, 503, 504]);
                var severity = status >= 500 ? 'critical' : (status >= 400 ? 'warn' : 'info');

                // Trap B1: 200x Latency Spike
                var latency;
                if (status >= 500 && rng.next() < 0.6) {
                    latency = parseFloat((rng.next() * 12000 + 4000).toFixed(1)); // 4,000 - 16,000 ms spike
                } else {
                    latency = parseFloat((rng.next() * 45 + 12).toFixed(1)); // 12 - 57 ms normal
                }

                var timestampCS = new Date(Date.UTC(2026, 10, 10, rng.nextInt(0, 23), rng.nextInt(0, 59), rng.nextInt(0, 59))).toISOString();

                rows.push({
                    trace_id: 'TRC-' + rng.nextInt(100000, 999999) + '-' + j,
                    timestamp_utc: timestampCS,
                    caller_service: caller,
                    target_service: target,
                    endpoint_route: route,
                    http_status: status,
                    latency_ms: latency,
                    payload_bytes: rng.nextInt(120, 8400),
                    cpu_util_pct: rng.next() < 0.1 ? null : parseFloat((rng.next() * 75 + 15).toFixed(1)),
                    memory_rss_mb: parseFloat((rng.next() * 512 + 128).toFixed(1)),
                    deployment_version: rng.choice(['v1.4.2', 'v1.4.3', 'v2.0-rc1']),
                    error_severity: severity
                });
            }
        } else {
            // Nutrition Science
            var cohorts = ['Urban-Affluent', 'Rural-Agrarian', 'Peri-Urban-Informal'];
            var slots = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
            var foods = ['Legumes', 'Leafy Greens', 'Ultra-Processed Snacks', 'Dairy & Eggs', 'Whole Grains', 'Lean Poultry'];
            var units = ['per-serving', 'per-100g', 'total-recipe'];

            for (var k = 0; k < rowCount; k++) {
                var pId = 'PT-' + (100 + (k % 20));
                var cohort = rng.choice(cohorts);
                var slot = rng.choice(slots);
                var food = rng.choice(foods);
                var unit = rng.choice(units);
                var isFasting = rng.next() < 0.15 ? 1 : 0;

                // Trap C1: Zero-inflation vs true zero in Vitamin C
                var vitC;
                if (isFasting) {
                    vitC = 0.0;
                } else if (rng.next() < 0.35) {
                    vitC = 0.0; // unlogged or literal zero
                } else {
                    vitC = parseFloat((rng.next() * 65 + 10).toFixed(1));
                }

                // Trap C2: Unit Discordance & Extreme Sodium
                var sodium;
                if (unit === 'total-recipe') {
                    sodium = parseFloat((rng.next() * 12000 + 4500).toFixed(1)); // whole recipe sodium!
                } else {
                    sodium = parseFloat((rng.next() * 750 + 120).toFixed(1));
                }

                var calories = unit === 'total-recipe' ? rng.nextInt(1400, 3200) : rng.nextInt(180, 650);
                var protein = parseFloat((rng.next() * 28 + 4).toFixed(1));

                rows.push({
                    record_id: 'NUT-2026-' + (5000 + k),
                    participant_id: pId,
                    survey_date: '2026-11-' + (10 + (k % 12)),
                    demographic_cohort: cohort,
                    meal_slot: slot,
                    food_category: food,
                    serving_quantity: parseFloat((rng.next() * 2.5 + 0.5).toFixed(1)),
                    serving_unit: unit,
                    calories_kcal: calories,
                    protein_grams: protein,
                    sodium_mg: sodium,
                    vitamin_c_mg: vitC,
                    is_fasting_period: isFasting
                });
            }
        }

        return {
            studentId: studentId,
            domain: domain,
            seed: seed,
            isCurveball: !!isCurveball,
            rowCount: rows.length,
            data: rows
        };
    }

    // 5. Convert Array of Objects to CSV String
    function toCSV(dataArray) {
        if (!dataArray || !dataArray.length) return '';
        var headers = Object.keys(dataArray[0]);
        var lines = [headers.join(',')];
        for (var i = 0; i < dataArray.length; i++) {
            var row = dataArray[i];
            var values = headers.map(function (h) {
                var val = row[h];
                if (val === null || val === undefined) return '';
                var str = String(val);
                if (str.indexOf(',') !== -1 || str.indexOf('"') !== -1 || str.indexOf('\n') !== -1) {
                    return '"' + str.replace(/"/g, '""') + '"';
                }
                return str;
            });
            lines.push(values.join(','));
        }
        return lines.join('\n');
    }

    // 6. Compute Deterministic Statistical Invariants
    function computeStableStats(dataArray) {
        if (!dataArray || !dataArray.length) {
            return { rows: 0, cols: 0, numericSum: 0, nullCount: 0 };
        }
        var rows = dataArray.length;
        var cols = Object.keys(dataArray[0]).length;
        var numericSum = 0;
        var nullCount = 0;

        for (var i = 0; i < rows; i++) {
            var row = dataArray[i];
            for (var key in row) {
                if (Object.prototype.hasOwnProperty.call(row, key)) {
                    var val = row[key];
                    if (val === null || val === undefined || val === '' || val === 'NA' || val === 'unknown' || val === '-' || Number.isNaN(val)) {
                        nullCount++;
                    } else if (typeof val === 'number') {
                        numericSum += val;
                    } else if (typeof val === 'string' && !isNaN(Number(val)) && val.trim() !== '') {
                        numericSum += Number(val);
                    }
                }
            }
        }
        return {
            rows: rows,
            cols: cols,
            numericSum: parseFloat(numericSum.toFixed(2)),
            nullCount: nullCount
        };
    }

    // 7. Graph Theory Extraction & Metric Computation (E, V)
    function computeGraphMetrics(dataArray, domain) {
        var nodesMap = {};
        var edges = [];

        for (var i = 0; i < dataArray.length; i++) {
            var r = dataArray[i];
            var source, target, weight = 1;

            if (domain === 'forensic') {
                source = r.relinquishing_auth || 'UNKNOWN_AUTH';
                target = r.receiving_auth || 'UNKNOWN_CUST';
            } else if (domain === 'cs' || domain === 'computer_science') {
                source = r.caller_service || 'unknown-caller';
                target = r.target_service || 'unknown-target';
                weight = r.latency_ms || 1;
            } else {
                source = r.food_category || 'General';
                target = r.demographic_cohort || 'Cohort';
                weight = r.calories_kcal || 1;
            }

            if (source && target && source !== target) {
                nodesMap[source] = (nodesMap[source] || 0) + 1;
                nodesMap[target] = (nodesMap[target] || 0) + 1;
                edges.push({ source: source, target: target, weight: weight });
            }
        }

        var nodes = Object.keys(nodesMap).map(function (k) {
            return { id: k, degree: nodesMap[k] };
        });
        nodes.sort(function (a, b) { return b.degree - a.degree; });

        return {
            nodeCount: nodes.length,
            edgeCount: edges.length,
            nodes: nodes,
            edges: edges,
            topHub: nodes.length > 0 ? nodes[0] : null
        };
    }

    // 8. Dynamic Seed-Derived Probe Calculator
    function computeProbeQuestion(seed, domain, cleanedData) {
        var rng = createPRNG(seed);
        var stats = computeStableStats(cleanedData);
        var graph = computeGraphMetrics(cleanedData, domain);

        var probeTypeIndex = rng.nextInt(0, 2);
        if (probeTypeIndex === 0) {
            return {
                probeId: 'PROBE-A-ROWCOUNT',
                questionText: 'What is the exact residual row count of your cleaned, deduplicated dataset?',
                expectedAnswer: stats.rows
            };
        } else if (probeTypeIndex === 1) {
            var hubNode = graph.topHub ? graph.topHub.id : 'N/A';
            var hubDegree = graph.topHub ? graph.topHub.degree : 0;
            return {
                probeId: 'PROBE-B-DEGREE',
                questionText: 'What is the computed degree centrality (total active connections) for central hub node "' + hubNode + '"?',
                expectedAnswer: hubDegree
            };
        } else {
            var rollUpVal = stats.numericSum;
            return {
                probeId: 'PROBE-C-ROLLUP',
                questionText: 'What is the total cumulative numeric sum (rounded to 2 decimal places) across all metric dimensions in the cleaned dataset?',
                expectedAnswer: rollUpVal
            };
        }
    }

    // 9. Cryptographic Fingerprint Derivations
    function computeFingerprints(seed, gate1, gate2, gate3) {
        var qStr = (gate1.queries || []).join(';;');
        var gStr = (gate1.grillAnswers || []).join(';;');
        var fp1 = sha256(seed + '::' + qStr + '::' + gStr);

        var statsStr = JSON.stringify(gate2.stableStats || {});
        var fp2 = sha256(seed + '::' + (gate2.cleaningCode || '') + '::' + statsStr + '::' + (gate2.justification || ''));

        var cfgStr = JSON.stringify(gate3.chartConfigs || {});
        var fp3 = sha256(seed + '::' + cfgStr + '::' + (gate3.comparativeAnalysis || '') + '::' + (gate3.probeAnswer !== undefined ? gate3.probeAnswer : ''));

        var finalPassCode = sha256(fp1 + '+' + fp2 + '+' + fp3 + '+' + seed);

        return {
            fp1: fp1,
            fp2: fp2,
            fp3: fp3,
            finalPassCode: finalPassCode
        };
    }

    // 10. Automated Invariant & Cryptographic Submission Verifier
    function verifySubmission(sub) {
        var results = {
            isValid: true,
            failingGate: null,
            studentId: sub ? sub.studentId : null,
            domain: sub ? sub.domain : null,
            checks: []
        };

        function addCheck(name, pass, msg) {
            results.checks.push({ name: name, pass: pass, msg: msg });
            if (!pass && results.isValid) {
                results.isValid = false;
                if (!results.failingGate) {
                    if (name.indexOf('Gate 1') !== -1) results.failingGate = 'gate1';
                    else if (name.indexOf('Gate 2') !== -1) results.failingGate = 'gate2';
                    else if (name.indexOf('Gate 3') !== -1) results.failingGate = 'gate3';
                    else results.failingGate = 'identity';
                }
            }
        }

        if (!sub || !sub.studentId || !sub.domain || !sub.seed) {
            addCheck('Payload Validation', false, 'Missing mandatory metadata (studentId, domain, or seed).');
            return results;
        }

        // Check 1: Seed Derivation Parity
        var expectedSeed = deriveSeed(sub.studentId);
        var seedMatches = (sub.seed === expectedSeed);
        addCheck('Identity & Seed Derivation', seedMatches, seedMatches ? 'Valid SHA-256 identity seed: ' + sub.seed.slice(0, 12) + '...' : 'Seed mismatch! Expected ' + expectedSeed.slice(0, 12) + '... but received ' + sub.seed.slice(0, 12) + '...');

        // Check 2: Dataset Regeneration
        var gen = generateDataset(sub.studentId, sub.domain, false);
        addCheck('Dataset Regeneration', gen.data.length > 0, 'Re-generated ' + gen.data.length + ' raw seeded rows.');

        // Check 3: Gate 2 Code Execution & Invariant Stability
        var cleaningFn;
        var cleanedDataRun1, cleanedDataRun2;
        var execSuccess = false;
        try {
            /* jshint ignore:start */
            var userCode = sub.gate2 && sub.gate2.cleaningCode ? sub.gate2.cleaningCode : '';
            // Wrap in function evaluator
            cleaningFn = new Function('rawData', userCode + '\nif (typeof cleanData === "function") return cleanData(rawData); return rawData;');
            cleanedDataRun1 = cleaningFn(JSON.parse(JSON.stringify(gen.data)));
            cleanedDataRun2 = cleaningFn(JSON.parse(JSON.stringify(gen.data)));
            execSuccess = Array.isArray(cleanedDataRun1);
            /* jshint ignore:end */
        } catch (e) {
            execSuccess = false;
        }

        addCheck('Gate 2 Code Execution', execSuccess, execSuccess ? 'Cleaning code executed successfully without runtime exceptions.' : 'Cleaning code threw an exception or did not return an array.');

        if (execSuccess) {
            var stats1 = computeStableStats(cleanedDataRun1);
            var stats2 = computeStableStats(cleanedDataRun2);
            var isStable = (stats1.rows === stats2.rows && stats1.numericSum === stats2.numericSum && stats1.nullCount === stats2.nullCount);
            addCheck('Gate 2 Deterministic Stability', isStable, isStable ? 'Determinism confirmed: Run 1 stats match Run 2 stats exactly.' : 'Nondeterministic script detected! Run 1 and Run 2 produced diverging results.');

            var submittedStats = sub.gate2 ? sub.gate2.stableStats : null;
            var statsMatch = submittedStats && (submittedStats.rows === stats1.rows) && (Math.abs(submittedStats.numericSum - stats1.numericSum) < 0.05);
            addCheck('Gate 2 Statistical Invariants Parity', statsMatch, statsMatch ? 'Actual stats (rows=' + stats1.rows + ', sum=' + stats1.numericSum + ') match submitted values.' : 'Stats drift: Computed (rows=' + stats1.rows + ', sum=' + stats1.numericSum + ') vs Submitted (rows=' + (submittedStats ? submittedStats.rows : 'null') + ', sum=' + (submittedStats ? submittedStats.numericSum : 'null') + ').');

            // Check 4: Calculated Probe Recalculation
            var probeData = computeProbeQuestion(sub.seed, sub.domain, cleanedDataRun1);
            var userProbeAns = sub.gate3 ? Number(sub.gate3.probeAnswer) : NaN;
            var expectedProbeAns = Number(probeData.expectedAnswer);
            var probeMatch = Math.abs(userProbeAns - expectedProbeAns) < 0.05;
            addCheck('Gate 3 Computed Dynamic Probe', probeMatch, probeMatch ? 'Probe [' + probeData.probeId + '] verified: ' + userProbeAns : 'Probe mismatch on [' + probeData.probeId + ']: expected ' + expectedProbeAns + ' but received ' + userProbeAns);
        }

        // Check 5: Cryptographic Hash Chain Parity
        var fps = computeFingerprints(sub.seed, sub.gate1 || {}, sub.gate2 || {}, sub.gate3 || {});
        var fp1Match = sub.gate1 && (sub.gate1.fingerprint === fps.fp1);
        var fp2Match = sub.gate2 && (sub.gate2.fingerprint === fps.fp2);
        var fp3Match = sub.gate3 && (sub.gate3.fingerprint === fps.fp3);
        var finalPassMatch = (sub.finalPassCode === fps.finalPassCode);

        addCheck('Gate 1 Fingerprint Seal', fp1Match, fp1Match ? 'Digest: ' + fps.fp1.slice(0, 16) + '...' : 'Gate 1 fingerprint drift.');
        addCheck('Gate 2 Fingerprint Seal', fp2Match, fp2Match ? 'Digest: ' + fps.fp2.slice(0, 16) + '...' : 'Gate 2 fingerprint drift.');
        addCheck('Gate 3 Fingerprint Seal', fp3Match, fp3Match ? 'Digest: ' + fps.fp3.slice(0, 16) + '...' : 'Gate 3 fingerprint drift.');
        addCheck('Final Pass Code Chain Seal', finalPassMatch, finalPassMatch ? 'Pass Code verified: ' + fps.finalPassCode.slice(0, 16) + '...' : 'Final pass code mismatch across hash chain.');

        return results;
    }

    return {
        SALT: SALT,
        sha256: sha256,
        deriveSeed: deriveSeed,
        createPRNG: createPRNG,
        generateDataset: generateDataset,
        toCSV: toCSV,
        computeStableStats: computeStableStats,
        computeGraphMetrics: computeGraphMetrics,
        computeProbeQuestion: computeProbeQuestion,
        computeFingerprints: computeFingerprints,
        verifySubmission: verifySubmission
    };
}));
