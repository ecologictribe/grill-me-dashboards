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

    // 4. Domain Dataset Generator (High Variance & Rich Diversity Engine)
    function generateDataset(studentId, domain, isCurveball) {
        domain = String(domain || 'forensic').toLowerCase();
        var seed = deriveSeed(studentId, (isCurveball ? SALT + '-curveball' : SALT));
        var rng = createPRNG(seed);

        // High Variance in Row Count: 90 to 155 rows (dynamically seeded)
        var rowCount = rng.nextInt(90, 155);
        var rows = [];

        if (domain === 'forensic') {
            var evidenceTypes = [
                'Ballistics (9mm Parabellum)', 'Ballistics (7.62x39mm Casing)', 'Biological / Nuclear DNA',
                'Touch DNA Swab', 'Digital Media (Encrypted SSD)', 'Mobile Device Extraction',
                'Narcotics (Opioid Assay)', 'Narcotics (Synthetic Cannabinoid)', 'Latent Fingerprints (Cyanoacrylate)',
                'Trace Fiber (Automotive)', 'Blood Spatter Swab', 'Toxicology (Vitreous Fluid)'
            ];
            var officers = [
                'Det. Miller #402', 'Inv. Kowalski #118', 'Sgt. Sterling #890', 'Tech. Vance #224',
                'Capt. Reyes #004', 'Det. Zhao #512', 'Insp. Thorne #331', 'Tech. O’Connor #772',
                'Sgt. Patel #109', 'Det. Washington #615', 'Inv. Lindqvist #804', 'Tech. Mercer #951',
                'Capt. Tanaka #208', 'Det. Benitez #443', 'Sgt. MacLeod #387', 'Inv. Al-Mansoor #619'
            ];
            var precincts = [
                'District-North-01', 'District-South-04', 'District-East-02', 'District-West-09',
                'Central-Forensic-Vault', 'Harbor-Precinct-11', 'Metro-Ballistics-Lab', 'State-DNA-Repository',
                'Suburban-Outpost-07', 'Judicial-Evidence-Annex'
            ];
            var nullEquivalents = ['', 'NA', 'unknown', '-', 'PENDING', 'UNCHECKED_CUSTODIAN'];

            // Seed-dependent corruption & distribution regime
            var nullRate = 0.12 + rng.next() * 0.14; // 12% to 26%
            var breachRate = 0.16 + rng.next() * 0.16; // 16% to 32%
            var breachDaysBase = 35 + rng.nextInt(0, 15);
            var breachDaysSpan = 45 + rng.nextInt(15, 60);
            var caseClusterSize = rng.nextInt(16, 32);

            for (var i = 0; i < rowCount; i++) {
                var caseNum = 1000 + (i % caseClusterSize);
                var isDupConflict = (i > 0 && i % 13 === 0);
                var caseId = 'CASE-CR-' + (isDupConflict ? (1000 + ((i - 1) % caseClusterSize)) : caseNum);
                var evType = rng.choice(evidenceTypes);
                
                // Trap A1: Null strings in relinquishing_auth with dynamic rate
                var relinquishing;
                if (rng.next() < nullRate) {
                    relinquishing = rng.choice(nullEquivalents);
                } else {
                    relinquishing = rng.choice(officers);
                }

                var receiving = rng.choice(officers);
                while (receiving === relinquishing) {
                    receiving = rng.choice(officers);
                }

                // Date formatting trap (mixed ISO vs DD/MM/YYYY vs YYYY/MM/DD)
                var dayOffset = (i % 45);
                var d = new Date(Date.UTC(2026, 8 + Math.floor(dayOffset / 30), (dayOffset % 28) + 1, rng.nextInt(6, 22), rng.nextInt(0, 59)));
                var timestamp;
                var pad = function(n) { return n < 10 ? '0' + n : n; };
                if (i % 7 === 0) {
                    timestamp = pad(d.getUTCDate()) + '/' + pad(d.getUTCMonth() + 1) + '/' + d.getUTCFullYear() + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
                } else if (i % 11 === 0) {
                    timestamp = d.getUTCFullYear() + '/' + pad(d.getUTCMonth() + 1) + '/' + pad(d.getUTCDate()) + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes());
                } else {
                    timestamp = d.toISOString();
                }

                // Trap: Turnaround tail breach (bimodal distribution with high variance)
                var turnaround;
                if (rng.next() < breachRate) {
                    // Critical statutory breach: 35 to 110 days (varies by seed)
                    turnaround = parseFloat((rng.next() * breachDaysSpan + breachDaysBase).toFixed(1));
                } else {
                    // Normal turnaround: 3 to 27 days
                    turnaround = parseFloat((rng.next() * 24 + 3).toFixed(1));
                }

                var precinct = rng.choice(precincts);
                var seal = rng.next() < 0.85 ? 'YES' : (rng.next() < 0.5 ? 'NO' : 'UNCHECKED');
                var gapFlag = (relinquishing === '' || relinquishing === 'NA' || seal === 'NO' || turnaround > 30) ? 1 : 0;

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
            var callers = [
                'api-gateway', 'auth-service', 'checkout-web', 'mobile-backend', 'inventory-worker',
                'billing-agent', 'recommendation-engine', 'search-indexer', 'notification-dispatch',
                'stream-consumer', 'fraud-detector', 'edge-proxy'
            ];
            var targets = [
                'user-db-pool', 'payment-gateway', 'redis-cache-cluster', 'order-ledger', 'audit-logger',
                'auth-service', 'inventory-db', 'notification-queue', 'search-shard-01', 'elastic-cluster',
                'session-store', 'analytics-sink'
            ];
            var routes = [
                '/v1/auth/token', '/v2/checkout/process', '/api/users/profile', '/v1/orders/create',
                '/healthz', '/v1/inventory/reserve', '/v2/search/products', '/api/billing/charge',
                '/v1/telemetry/report', '/api/notifications/send', '/v1/fraud/screen', '/v2/cart/sync',
                '/api/stream/event', '/v1/config/cluster', '/v2/payment/refund'
            ];
            // High cardinality dynamic routes (25 to 45 unique per seed)
            var dynCount = rng.nextInt(25, 45);
            for (var r = 0; r < dynCount; r++) {
                routes.push('/api/dynamic/route_' + r + '/trace');
            }

            var versions = ['v1.4.2', 'v1.4.3', 'v2.0-rc1', 'v2.0.1', 'v2.1-canary', 'v1.3.9-legacy'];
            var alarmStormRate = 0.78 + rng.next() * 0.11; // 78% to 89% heartbeats
            var spikeBase = 4500 + rng.nextInt(1000, 5000);
            var spikeRange = 8000 + rng.nextInt(2000, 15000); // 8,000 to 28,000 ms spikes

            for (var j = 0; j < rowCount; j++) {
                var caller = rng.choice(callers);
                var target = rng.choice(targets);
                var route = rng.choice(routes);
                var isAlarmStorm = rng.next() < alarmStormRate;
                var status = isAlarmStorm ? 200 : rng.choice([401, 403, 404, 500, 502, 503, 504]);
                var severity = status >= 500 ? 'critical' : (status >= 400 ? 'warn' : 'info');

                // Trap B1: 200x Latency Spike with seed variance
                var latency;
                if (status >= 500 && rng.next() < 0.65) {
                    latency = parseFloat((rng.next() * spikeRange + spikeBase).toFixed(1));
                } else if (status >= 400) {
                    latency = parseFloat((rng.next() * 450 + 90).toFixed(1));
                } else {
                    latency = parseFloat((rng.next() * 48 + 10).toFixed(1)); // 10 - 58 ms normal
                }

                var tsHour = rng.nextInt(0, 23);
                var tsMin = rng.nextInt(0, 59);
                var tsSec = rng.nextInt(0, 59);
                var timestampCS = new Date(Date.UTC(2026, 10, 10 + (j % 15), tsHour, tsMin, tsSec)).toISOString();

                rows.push({
                    trace_id: 'TRC-' + rng.nextInt(100000, 999999) + '-' + j,
                    timestamp_utc: timestampCS,
                    caller_service: caller,
                    target_service: target,
                    endpoint_route: route,
                    http_status: status,
                    latency_ms: latency,
                    payload_bytes: rng.nextInt(110, 18500),
                    cpu_util_pct: rng.next() < 0.08 ? null : parseFloat((rng.next() * 85 + 10).toFixed(1)),
                    memory_rss_mb: parseFloat((rng.next() * 768 + 128).toFixed(1)),
                    deployment_version: rng.choice(versions),
                    error_severity: severity
                });
            }
        } else {
            // Nutrition Science
            var cohorts = [
                'Urban-Affluent', 'Rural-Agrarian', 'Peri-Urban-Informal', 'Elderly-Care-Resident',
                'Collegiate-Athlete', 'Pediatric-School-Age', 'Shift-Worker-Industrial'
            ];
            var slots = ['Breakfast', 'Morning-Snack', 'Lunch', 'Afternoon-Tea', 'Dinner', 'Late-Snack'];
            var foods = [
                'Legumes & Pulses', 'Leafy Dark Greens', 'Ultra-Processed Snacks', 'Dairy & Fermented Eggs',
                'Whole Ancient Grains', 'Lean Poultry & Fish', 'Root Tubers & Starch', 'Cruciferous Vegetables',
                'Fortified Breakfast Cereals', 'Cold-Pressed Seed Oils', 'Processed Deli Meats', 'Citrus & Tropical Fruits'
            ];
            var units = ['per-serving', 'per-100g', 'total-recipe', 'per-portion', 'heaped-tablespoon'];

            var zeroInfRate = 0.28 + rng.next() * 0.18; // 28% to 46% zero inflation
            var sodiumSpikeBase = 6000 + rng.nextInt(1000, 5000);
            var sodiumSpikeSpan = 8000 + rng.nextInt(2000, 12000); // reaches 14,000 to 23,000 mg

            for (var k = 0; k < rowCount; k++) {
                var pId = 'PT-' + (100 + (k % 35));
                var cohort = rng.choice(cohorts);
                var slot = rng.choice(slots);
                var food = rng.choice(foods);
                var unit = rng.choice(units);
                var isFasting = rng.next() < 0.14 ? 1 : 0;

                // Trap C1: Zero-inflation vs true zero in Vitamin C
                var vitC;
                if (isFasting) {
                    vitC = 0.0;
                } else if (rng.next() < zeroInfRate) {
                    vitC = 0.0; // unlogged or literal zero
                } else {
                    vitC = parseFloat((rng.next() * 85 + 8).toFixed(1));
                }

                // Trap C2: Unit Discordance & Extreme Sodium
                var sodium;
                if (unit === 'total-recipe') {
                    sodium = parseFloat((rng.next() * sodiumSpikeSpan + sodiumSpikeBase).toFixed(1));
                } else {
                    sodium = parseFloat((rng.next() * 950 + 80).toFixed(1));
                }

                var calories = unit === 'total-recipe' ? rng.nextInt(1600, 4200) : rng.nextInt(140, 750);
                var protein = parseFloat((rng.next() * 38 + 3).toFixed(1));

                rows.push({
                    record_id: 'NUT-2026-' + (5000 + k),
                    participant_id: pId,
                    survey_date: '2026-11-' + (10 + (k % 18)),
                    demographic_cohort: cohort,
                    meal_slot: slot,
                    food_category: food,
                    serving_quantity: parseFloat((rng.next() * 3.2 + 0.4).toFixed(1)),
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
        var justStr = Array.isArray(gate2.justifications) ? gate2.justifications.join(';;') : (gate2.justification || '');
        var fp2 = sha256(seed + '::' + (gate2.cleaningCode || '') + '::' + statsStr + '::' + justStr);

        var cfgStr = JSON.stringify(gate3.chartConfigs || {});
        var compStr = Array.isArray(gate3.constraintAnswers) ? gate3.constraintAnswers.join(';;') : (gate3.comparativeAnalysis || '');
        var fp3 = sha256(seed + '::' + cfgStr + '::' + compStr + '::' + (gate3.probeAnswer !== undefined ? gate3.probeAnswer : ''));

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
