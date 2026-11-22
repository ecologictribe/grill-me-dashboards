# PROJECT WORK SPECIFICATION: THE WORK-BOUND INTERACTIVE DASHBOARD
## Cryptographically Verified, AI-Collaborative Domain Assessment

**Document ID:** PROJ-SPEC-2026-GATE  
**Version:** 2.0 (Synthesis of PRD-0 & PRD-1)  
**Target Course:** Data Visualization Architecture & Engineering (`grill_me_dashboard`)  
**Lead Trainer / Author:** Puneet Arora (Aplly.xyz)  
**Target Student Cohorts:** Forensic Science, Computer Science, Nutrition Science  
**Companion Document:** [specs/DOMAIN-SCOPING.md](file:///d:/grill_me_dashboard/specs/DOMAIN-SCOPING.md) (Deep Dive on Traps, Schemas & Interaction Encodings)  
**Status:** Canonical Project Work Specification  

---

## 1. Executive Summary & Problem Statement

### 1.1 The Assessment Paradox in the AI Era
Traditional data visualization assignments assess **static artifacts** (PDF reports, exported charts, or pre-computed gate tokens). In modern classrooms, these artifacts are trivial to bypass: students prompt an LLM to generate code or summarize findings without engaging in the underlying data hygiene, dimensional modeling, or visual reasoning. When assessments grade *outputs* rather than *processes*, student submissions become homogeneous, collusive, and decoupled from genuine problem solving.

### 1.2 The Project Work Paradigm
This project transitions students from bite-sized challenge exercises to an **end-to-end, work-bound interactive dashboard engineering capstone**. 

Under this specification:
1. **AI is an explicitly permitted, mandatory collaborator** — students are encouraged to use LLMs for scaffolding, SQL optimization, and component generation.
2. **Work is bound cryptographically to the student** — every student’s dataset, statistical invariants, probe questions, and gate passes are deterministically derived from their individual student ID.
3. **Visualization is bound to interaction & preprocessing** — students do not build generic charts. They build an interactive system that solves **domain-specific visualization failure modes** under five strict interaction constraints.
4. **Verification is instant and offline** — submissions compile into a single `submission.json` verifiable in <90 seconds via an offline, in-browser verification engine (`verify.html`).

---

## 2. Dashboard Typology & Domain-Specific Failure Modes

Rather than creating a generic BI dashboard, students must design their system along a deliberate functional spectrum (**Operational**, **Analytical / Tactical**, or **Strategic**) tailored to their academic discipline.

### 2.1 The Domain Typology Matrix

| Dimension | Forensic Science | Computer Science | Nutrition Science |
| :--- | :--- | :--- | :--- |
| **Operational** *(Near real-time, triage, front-line)* | **Evidence Intake & Chain of Custody:** Real-time tracking of evidentiary custody transfers, statutory lab turnaround breaches, and active case backlogs. | **System Reliability Stream:** Real-time microservice incident telemetry, API error bursts, p99 latency spikes, and deployment health monitors. | **Dietary Intake Adherence Feed:** Near real-time patient meal compliance feed, flagged fasting gaps, and implausible caloric logs. |
| **Analytical / Tactical** *(Exploration, correlation, segmentation)* | **Link & Pattern Analysis:** Suspect–victim–location co-occurrence networks, multi-jurisdiction temporal clustering, and weapon ballistic matching. | **Service Dependency Topology:** Microservice call graphs, cyclic package dependencies, commit-author-service fault correlations. | **Nutrient Deficiency Clustering:** Subpopulation deficiency profiles, multi-nutrient interaction vectors, and food-desert geographic correlation. |
| **Strategic** *(Executive KPIs, policy trends, benchmarks)* | **Judicial Clearance Scorecard:** Long-term case closure rates vs. state/national statutory thresholds, court backlog forecast. | **Engineering Velocity & Health:** Defect escape ratios, technical debt index, mean time to recovery (MTTR), and engineer burnout metrics. | **Public Health Nutrition Security Index:** Longitudinal community nutritional adequacy indices vs. national dietary targets. |

### 2.2 Injected Domain Traps & Visualization Failure Modes

The seeded dataset generator injects structural anomalies tailored to each discipline. These are not arbitrary data quality issues; they represent **failure modes where naive visualization misleads decision-makers**.

```
       ┌────────────────────────────────────────────────────────┐
       │             INJECTED STRUCTURAL DATA TRAPS             │
       └───────────────────────────┬────────────────────────────┘
                                   │
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
  FORENSIC SCIENCE         COMPUTER SCIENCE          NUTRITION SCIENCE
  • Null strings ("NA")    • High cardinality        • Zero-inflation vs
  • Non-random missingness • 200x latency outliers     true zero
  • Duplicate case IDs     • Clock skew / timezone   • Extreme nutrient skew
  • Format inconsistencies • Invisible filter state  • Unit disharmony
         │                         │                         │
         ▼                         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Evidentiary Bias│       │  Axis Deception │       │ False Precision │
│& Topology Break │       │& Spaghetti Chaos│       │& Masked Subgroup│
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

#### A. Forensic Science: Evidentiary Bias & Topology Distortion
* **Trap A1: Null-Equivalent Strings:** Fields contain `""`, `"NA"`, `"unknown"`, or `"-"`. Standard automated parsers treat these as valid categories rather than nulls. If naively dropped, case backlogs are systematically undercounted.
* **Trap A2: Non-Random Missingness:** Missing chain-of-custody logs cluster around specific precincts or shifts. Dropping rows with nulls deletes evidence and biases the network graph.
* **Trap A3: Conflicting Duplicate Case IDs:** Multiple rows share the same ID with contradictory metadata (different officer or date). Resolving this incorrectly fractures a single physical suspect/evidence entity into multiple disconnected network nodes.
* **Visualization Hazard:** *Aggregation Hides Tail Failures.* Average turnaround time appears within acceptable limits while 15% of critical forensic tests breach statutory limits, causing case dismissals.

#### B. Computer Science: Scale, High Cardinality & Axis Deception
* **Trap B1: Heavy-Tailed Latency Outliers:** Latency columns feature 99th-percentile spikes 200× above the median. Rendering this on a linear axis compresses 98% of healthy transactions into an unreadable baseline strip.
* **Trap B2: High Cardinality Categoricals:** Microservices or endpoint IDs exceed 100+ unique values. Direct bar charting results in illegible "spaghetti" layouts.
* **Trap B3: Clock Skew & Timezone-Naive Timestamps:** Mixed ISO-8601 strings and UTC/local offsets create paradoxical causal ordering in event timelines.
* **Visualization Hazard:** *Invisible Filter State.* In complex multi-tier dashboards, users drill down into a microservice without realizing an upstream global date or cluster filter remains active, leading to erroneous incident root-cause conclusions.

#### C. Nutrition Science: Sparsity, Zero-Inflation & Subgroup Divergence
* **Trap C1: Zero-Inflation vs. True Zeros:** Nutrient columns (e.g., Vitamin C) feature 35%+ literal `0` values. Naively treating zeros as missing data distorts the true distribution; conversely, treating missing logs as true zeros suggests clinical starvation.
* **Trap C2: Multi-Order-of-Magnitude Skew:** Extreme micronutrient intake (e.g., sodium or retinol megadoses) distorts normal distributions.
* **Trap C3: Inconsistent Measurement Units:** Data mixes per-serving, per-100g, and total recipe measures within the same column.
* **Visualization Hazard:** *Simpson's Paradox / Masked Subgroup Divergence.* Aggregate population health indices appear stable over time while vulnerable socioeconomic subgroups experience catastrophic nutritional decline.

---

## 3. Five Mandatory Interactive Architecture Requirements

Regardless of domain, all student dashboards must implement five interactive capabilities natively in the client.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   MANDATORY CLIENT INTERACTION ARCHITECTURE                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Multi-Tab Architecture:  [Overview Tab] ──► [Breakdown Tab] ──► [Detail] │
│    └─► Global Filter State + Interactive Filter Propagation Map             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. On-the-Fly Processing:   Client-Side Re-Aggregation & Derived Metrics    │
│    └─► Zero-page-reload transformations reacting to user inputs             │
├─────────────────────────────────────────────────────────────────────────────┤
│ 3. Heterogeneous Cross-Brushing: Network Node Selection                     │
│    └─► Simultaneously updates and highlights Timeline + Bar Visuals         │
├─────────────────────────────────────────────────────────────────────────────┤
│ 4. Lossless Hierarchical Drill-Down / Roll-Up:                              │
│    Level 1 (Macro) ◄──► Level 2 (Meso) ◄──► Level 3 (Micro Grain)           │
├─────────────────────────────────────────────────────────────────────────────┤
│ 5. Graph Theory (E, V) Structural Intelligence:                             │
│    Nodes (V) + Edges (E) + Computed Metric (Degree/Betweenness/Community)   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Requirement 1: Multi-Tab Architecture & Filter Propagation Map
* **Three-Tier View Hierarchy:** Dashboards must feature at least three synchronized views:
  1. **Overview (Macro):** Executive KPI cards, system health scorecards, global anomaly status.
  2. **Breakdown (Meso):** Categorical, temporal, or spatial distributions.
  3. **Detail (Micro):** Entity-level inspection, raw transaction audit logs, chain-of-custody records.
* **Global Filter Synchronization:** Filters applied on Tab 1 must persist and update visuals across Tabs 2 and 3.
* **Filter Propagation Map:** The dashboard UI must include an interactive or modal diagnostic view mapping exactly which UI controls propagate to which downstream visual components.

### Requirement 2: On-the-Fly Client-Side Processing
* All aggregations, ranking transformations, and derived indices must execute **live in browser memory** upon filter manipulation without full page reloads.
* This exposes preprocessing defects immediately: flawed data types, unparsed dates, or NaN imputations will break client-side aggregations during live interaction.

### Requirement 3: Cross-Linking & Linked Brushing Across Heterogeneous Visuals
* Selecting an element in one visual must instantly highlight or filter corresponding data points across **at least two visually and structurally distinct charts**.
* *Heterogeneous Constraint:* The views must utilize different visual grammars (e.g., selecting a node in a **Network Graph** must brush the corresponding temporal intervals on a **Timeline** and filter categories on a **Ranked Bar Chart**).

### Requirement 4: Deep Lossless Drill-Down and Roll-Up
* The system must implement a strict **three-level hierarchy**:
  * *Forensic:* Jurisdictional District → Precinct / Facility → Case Evidence Item.
  * *Computer Science:* Service Cluster → Microservice Container → Endpoint Thread Trace.
  * *Nutrition:* Regional Population → Demographic Cohort → Individual Meal Log.
* **Lossless Roll-Up Contract:** Navigating back up from Level 3 to Level 1 must mathematically match the exact initial aggregate value (verifying zero row loss or double-counting).

### Requirement 5: Graph Theory (E, V) Integration & Metric-Driven Encoding
* At least one tab must render a topological network graph:
  * **Vertices ($V$):** Distinct entities (officers/suspects, microservices, food groups).
  * **Edges ($E$):** Documented interactions (custody transfers, network RPCs, co-consumption).
  * **Visual Encodings:** Edge stroke/opacity must reflect interaction frequency/weight; node radius must encode a computed graph metric.
* **Structural Graph Metric:** The student must implement client-side computation of at least one formal graph metric:
  * Degree Centrality
  * Betweenness Centrality
  * Community / Cluster Detection
* The calculated metric must actively govern dashboard filtering or visual thresholding.

---

## 4. The 3-Gate Cryptographic Assessment Workflow

To prevent LLM bypass and collusion, student progress is bound to a deterministic cryptographic pipeline.

```
 Student ID + Salt
        │
        ▼
 ┌──────────────┐
 │ SHA-256 Seed │ ──► Deterministic PRNG ──► Unique Synthetic Dataset
 └──────┬───────┘
        │
        ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ GATE 1: DIAGNOSE (In-Browser SQL Sandbox)                              │
 │ • Identify injected structural defects via SQL                         │
 │ • Answer 2 domain Grill-Me interrogation prompts                       │
 │ • Compute: fingerprint_1 = SHA256(seed + SQL + grill_1)                │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ GATE 2: PREPROCESS (Cleaning & Transformation)                         │
 │ • Execute SQL / JS cleaning script                                     │
 │ • Verify Deterministic Stability (Run 1 stats === Run 2 stats)         │
 │ • Justify imputation/exclusion strategy vs. alternative                │
 │ • Compute: fingerprint_2 = SHA256(seed + code + stats + justification) │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
 ┌────────────────────────────────────────────────────────────────────────┐
 │ GATE 3: COMPARE & BUILD (Dual Dashboard & Probe)                       │
 │ • Dual render: Raw Broken Data vs. Cleaned Data Dashboard              │
 │ • Enforce 5 Interactive Architecture Requirements                      │
 │ • Submit Comparative Analysis (cite ≥2 visual deltas)                  │
 │ • Answer Seed-Generated Randomized Computed Probe                      │
 │ • Compute: fingerprint_3 = SHA256(seed + configs + probe + analysis)   │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │     FINAL PASS CODE     │
                        │ SHA256(fp1+fp2+fp3+seed)│
                        └────────────┬────────────┘
                                     │
                                     ▼
                        Export `submission.json`
```

### 4.1 Deterministic Identity & Seeding Formula
* **Salt Constant:** Fixed string embedded in the application source code (`"gatechallenge-2026-v2"`).
* **Seed Derivation:**
  $$\text{seed} = \text{SHA-256}(\text{StudentID} + \text{Salt})$$
* **Deterministic PRNG:** The first 16 hexadecimal characters of `seed` initialize a 32-bit PRNG (`mulberry32`), generating a unique dataset of 80–120 rows with injected domain defects.
* Two students with different IDs receive different data values, outlier magnitudes, and probe questions by construction.

### 4.2 Gate Breakdown & Cryptographic Specifications

#### Gate 1: Diagnose (Exploratory Data Analysis & Defect Discovery)
* **Interface:** Integrated in-browser `sql.js` (SQLite WASM) query workbench.
* **Tasks:**
  1. Write and execute SQL queries to locate the domain-specific data traps (null-equivalents, distribution skews, duplicate keys).
  2. Complete two domain-specific Grill Me interrogation prompts requiring qualitative justification of discovered traps.
* **Fingerprint Formula:**
  $$\text{fingerprint}_1 = \text{SHA-256}(\text{seed} + \sum \text{SQL\_Queries} + \sum \text{Grill\_Answers}_1)$$

#### Gate 2: Preprocess (Data Harmonization & Stability Verification)
* **Interface:** In-browser SQL / JavaScript data transformation runner.
* **Tasks:**
  1. Author a cleaning pipeline that normalizes date/key formats, handles missing values ethically, harmonizes units, and resolves entity conflicts.
  2. Compute deterministic statistical invariants across the cleaned dataset:
     $$\text{stableStats} = \{\text{rows}, \text{cols}, \sum \text{numericCols (2 d.p.)}, \text{remainingNulls}\}$$
  3. **The Stability Check:** The cleaning script is executed twice in succession. If `stableStats(Run 1) !== stableStats(Run 2)`, the submission is hard-blocked (preventing nondeterministic hacks or mutable global state).
  4. Submit a written justification defending the imputation/exclusion strategy against alternatives.
* **Fingerprint Formula:**
  $$\text{fingerprint}_2 = \text{SHA-256}(\text{seed} + \text{CleaningCode} + \text{stableStats} + \text{Justification})$$

#### Gate 3: Compare & Build (Interactive System & Computed Probe)
* **Interface:** Full interactive dashboard environment (HTML5/Canvas/Chart.js/D3).
* **Tasks:**
  1. Render a **Dual Comparison View**: Raw Data Dashboard vs. Cleaned Hardened Dashboard.
  2. Implement all **Five Interaction Architecture Requirements** (Multi-tab, On-the-fly, Cross-brushing, Lossless Drill-down, and Graph metric integration).
  3. Author a **Comparative Analysis** (minimum 250 characters) detailing at least two distinct decisions where uncleaned data produced visual falsehoods.
  4. Resolve a **Seed-Generated Dynamic Probe Question**. The question is selected from a seed-indexed bank and requires an exact numeric answer computed from the student’s unique cleaned data:
     * *Probe Type A:* Residual row count following deduplication.
     * *Probe Type B:* Degree or betweenness centrality score of a designated entity node.
     * *Probe Type C:* Total roll-up aggregate value when collapsing Level 3 back to Level 1.
* **Fingerprint Formula:**
  $$\text{fingerprint}_3 = \text{SHA-256}(\text{seed} + \text{ChartConfigs} + \text{ComparativeAnalysis} + \text{ProbeAnswer})$$

#### Final Pass Code & Export Bundle
$$\text{FINAL\_PASS\_CODE} = \text{SHA-256}(\text{fingerprint}_1 + \text{fingerprint}_2 + \text{fingerprint}_3 + \text{seed})$$

The student exports a single, tamper-evident file: `submission.json`.

```json
{
  "studentName": "Alex Chen",
  "studentId": "FS-2026-8812",
  "domain": "Forensic",
  "seed": "7f8b3c...",
  "timestamp": "2026-11-22T08:30:00Z",
  "gate1": {
    "queries": ["SELECT * FROM evidence WHERE...", "..."],
    "grillAnswers": ["Dropping rows with NA strings in chain-of-custody..."],
    "fingerprint": "a1b2c3..."
  },
  "gate2": {
    "cleaningCode": "function cleanData(data) { ... }",
    "stableStats": { "rows": 94, "cols": 8, "numericSum": 4182.50, "nullCount": 0 },
    "justification": "Preserved chain of custody gaps by explicit null-banding...",
    "fingerprint": "d4e5f6..."
  },
  "gate3": {
    "interactionMap": { "tab1Filter": ["tab2BarChart", "tab3KPICard"] },
    "chartConfigs": { "network": { "...": "..." }, "timeline": { "...": "..." } },
    "comparativeAnalysis": "In the raw dashboard, mean turnaround obscured 14 cases...",
    "probeId": "PROBE-B-DEGREE",
    "probeAnswer": 6,
    "fingerprint": "7g8h9i..."
  },
  "finalPassCode": "9z8y7x..."
}
```

---

## 5. Automated Verification & Defense Architecture

### 5.1 Instructor Verification Tool (`verify.html`)
The instructor receives `submission.json` and drops it into `verify.html`. The verifier executes zero network calls, running completely client-side in seconds:

1. **Identity & Seed Validation:** Recomputes `seed = SHA-256(studentId + salt)` and confirms parity with the submitted seed.
2. **Re-Execution of Code & Invariants:**
   - Runs the raw dataset generator with `seed`.
   - Re-executes the student’s cleaning code against the generated data.
   - Computes actual summary statistics and asserts `actualStats === submittedStats`.
3. **Probe Recalculation:** Computes the mathematical ground-truth for the assigned probe ID and verifies `submittedProbeAnswer === groundTruth`.
4. **Fingerprint & Pass Code Chain Verification:** Recomputes `fingerprint_1`, `fingerprint_2`, `fingerprint_3`, and `FINAL_PASS_CODE`.
5. **Visual Result Display:**
   - `MATCH ✅`: All gates, statistical invariants, and hash digests match perfectly.
   - `MISMATCH ❌`: Pinpoints exact failure gate (e.g., *Gate 2 Mismatch: Code output produces sum of 4110.20, but submitted JSON claimed 4182.50*).
   - **Collusion Alert:** If two students submit identical code or text under different IDs, the seed mismatch immediately invalidates the entire hash chain.

### 5.2 The Live Curveball Defense (Oral Viva)
Passing the automated verifier qualifies the student for the **Live Curveball Presentation** (5–7 minutes):
1. **The Live Data Swap:** The instructor provides an unseen `_v2_curveball.csv` (same schema, new seed, fresh outliers, shifted category distributions).
2. **Live Execution:** The student drops the curveball CSV into their dashboard live.
3. **Evaluation:** Hardcoded charts, static DOM hacks, and fragile brittle scripts immediately crash or render distorted visuals, while well-architected client-side logic updates seamlessly.
4. **Viva Question:** The instructor or peer red-team probes a specific design decision (e.g., *"Why did you select degree centrality rather than betweenness to scale your node radii?"*).

---

## 6. Evaluation Scorecard & Rubric (100 Points Total)

| Category | Weight | Evaluation Criteria |
| :--- | :---: | :--- |
| **Section A: Cryptographic Integrity & Verifier Pass** | **25 pts** | • Clean `MATCH ✅` in `verify.html` with zero console exceptions (15 pts).<br>• Zero integrity drift across all 3 gate fingerprints (5 pts).<br>• Accurate resolution of the seed-dependent calculated probe (5 pts). |
| **Section B: Preprocessing Rigor & Data Hygiene** | **25 pts** | • Comprehensive detection of all domain-injected traps in Gate 1 (10 pts).<br>• Deterministic stability in Gate 2 (Run 1 stats === Run 2 stats) (5 pts).<br>• Justified handling of missingness, units, and outliers without evidentiary bias or data destruction (10 pts). |
| **Section C: Interactive Dashboard Architecture** | **30 pts** | • Multi-tab navigation with working Global Filter Context & Filter Propagation Map (6 pts).<br>• Responsive on-the-fly client-side aggregation (6 pts).<br>• Cross-linking / linked brushing across heterogeneous visuals (6 pts).<br>• Lossless 3-level hierarchical drill-down and roll-up (6 pts).<br>• Graph theory integration with computed metric-driven encoding (6 pts). |
| **Section D: Comparative Analysis & Live Defense** | **20 pts** | • Rigorous comparative analysis detailing raw vs. cleaned visual failure modes (8 pts).<br>• Live Curveball CSV drop test passes without crash or layout collapse (7 pts).<br>• Coherent defense of architectural decisions during oral viva (5 pts). |

---

## 7. Deliverables & Technical Architecture

### 7.1 Student Deliverables
1. `submission.json` — The exported cryptographic state file uploaded to the course LMS.
2. `dashboard.html` (or project repo) — Standalone client-side application containing:
   - Gate 1 SQL sandbox (`sql.js`).
   - Gate 2 Preprocessing & Stability runner.
   - Gate 3 Dual-view interactive dashboard meeting all 5 interaction requirements.
   - Dynamic CSV File Dropzone (accepting live curveball files).
3. Live Viva Defense on presentation day.

### 7.2 Instructor Platform Files in Repo
- `project_idea/prd0.txt` & `project_idea/prd1.txt` — Source foundational specifications.
- `specs/PROJECT-WORK-SPEC.md` — This canonical specification document.
- `index.html` / `gate-challenge/index.html` — Static student-facing application.
- `verify.html` — Instructor offline verification tool.
- `scripts/generate-project-datasets.js` — Seeded PRNG domain dataset generator.

---

## 8. Summary of Project Innovations

| Traditional Homework | Previous Assignment 2 | This Project Work |
| :--- | :--- | :--- |
| Static PDF export | Pre-labeled challenge card + single CSV | Unlabeled, per-student seeded mystery dataset |
| Generic single-chart output | Isolated HTML/Power BI fix | 3-tier multi-tab interactive system with linked brushing |
| Easily faked with direct LLM prompts | Presentation requirement | Cryptographically bound hash chain + live curveball swap |
| Disconnected from domain semantics | Generic synthetic traps | Deep domain failure modes (Forensic bias, CS scale, Nutrition skew) |
| Manual grading bottleneck | Manual scorecard | <90s offline automated verification via `verify.html` |
