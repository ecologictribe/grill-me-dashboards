# DOMAIN SCOPING SPECIFICATION: SPECIALIZED VISUALIZATION PROBLEM SPACES
## Domain-Authentic Architectures for Forensic Science, Computer Science, and Nutrition Science

**Document ID:** PROJ-SPEC-2026-DOMAINS  
**Version:** 1.0 (Canonical Domain Scoping Document)  
**Parent Document:** [PROJECT-WORK-SPEC.md](file:///d:/grill_me_dashboard/specs/PROJECT-WORK-SPEC.md)  
**Author / Trainer:** Puneet Arora (Aplly.xyz)  
**Context Repository:** `grill_me_dashboard`  
**Status:** Approved for Project Work Execution  

---

## 1. Executive Summary & Pedagogical Mandate

### 1.1 The Departure from Generic Datasets
In introductory visualization courses, students typically practice on sanitized, generic datasets (e.g., student marks, canteen budgets, retail sales). While adequate for teaching basic bar charts and pie charts, these datasets shield students from the fundamental tension of data engineering: **the dataset is never just dirty in an abstract way; it is dirty in ways that map directly onto visualization failure modes.**

This document defines the **Domain Scoping** for the Capstone Project Work. It synthesizes the pedagogical challenges of the course (`challenges/challenges.txt`), the synthetic dataset architectures (`datasets/`, `scripts/generate-datasets.js`, and `scripts/generate-a3-datasets.js`), and the project requirements (`project_idea/prd0.txt` and `project_idea/prd1.txt`).

Students must commit to **one of three high-stakes disciplines**:
1. **Forensic Science:** The problem space of **Integrity, Chain of Custody, and Evidentiary Bias**.
2. **Computer Science:** The problem space of **Scale, High Cardinality, Telemetry, and Dependency Topology**.
3. **Nutrition Science:** The problem space of **Sparsity, Zero-Inflation, Clinical Skew, and Subgroup Divergence**.

### 1.2 Core Principle: Injected Traps Cause Visual Deception
In each domain, the synthetic data generator injects specific structural defects. If a student performs naive cleaning or asks an LLM to generate standard visualizations, the resulting charts will **visibly lie, distort distributions, fracture network topologies, or hide systemic failures**.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DOMAIN SCOPING & FAILURE MODE ALIGNMENT                         │
├─────────────────────────┬───────────────────────────┬──────────────────────────────────┤
│    FORENSIC SCIENCE     │     COMPUTER SCIENCE      │        NUTRITION SCIENCE         │
├─────────────────────────┼───────────────────────────┼──────────────────────────────────┤
│ Core Problem:           │ Core Problem:             │ Core Problem:                    │
│ EVIDENTIARY BIAS &      │ SCALE, CARDINALITY &      │ SPARSITY, ZERO-INFLATION &       │
│ CHAIN-OF-CUSTODY GAPS   │ AXIS DECEPTION            │ MASKED SUBGROUP DIVERGENCE       │
├─────────────────────────┼───────────────────────────┼──────────────────────────────────┤
│ Visualization Trap:     │ Visualization Trap:       │ Visualization Trap:              │
│ Aggregation masks tail  │ Linear scale flattens     │ Aggregate averages mask          │
│ statutory breaches;     │ p99 latency; high-card    │ vulnerable subgroup malnutrition;│
│ null strings drop nodes │ "spaghetti" chaos;        │ true zeros conflated with        │
│ from evidence networks. │ invisible filter states.  │ missing sensor entries.          │
├─────────────────────────┼───────────────────────────┼──────────────────────────────────┤
│ Graph Topology (E, V):  │ Graph Topology (E, V):    │ Graph Topology (E, V):           │
│ Nodes = Suspects/Cases  │ Nodes = Microservices     │ Nodes = Nutrients / Foods        │
│ Edges = Custody Handoffs│ Edges = RPC / Call Traces │ Edges = Co-ingestion / Synergies │
└─────────────────────────┴───────────────────────────┴──────────────────────────────────┘
```

---

## 2. Course Challenge & Dataset Cross-Mapping

The 22 foundational failure modes ([challenges/challenges.txt](file:///d:/grill_me_dashboard/challenges/challenges.txt)), the 20 case challenges (`C1–C20`), and the Mystery Dataset Packs (`Alpha–Zeta`) directly map into these three domains. Students must leverage these mappings to diagnose their assigned data.

### 2.1 Mapping Matrix: Course Materials to Specialized Domains

| Domain | Relevant Course Failure Modes (Part A) | Existing Challenge Datasets (Part B / C) | Mystery Multi-Trap Packs | Primary Trap Manifestation in Domain |
| :--- | :--- | :--- | :--- | :--- |
| **Forensic Science** | • **#3** Graph & Network Layout Chaos<br>• **#6** Latent Pipeline Failures<br>• **#11** Dark Patterns (Truncated axes)<br>• **#13** Semantic Layer Conflicts<br>• **#15** Privacy & PII Leakage | • **C2** (`challenge-02-lab-status.csv`)<br>• **C3** (`challenge-03-missing-tuesday.csv`)<br>• **C8** (`challenge-08-recycling-rows.csv`)<br>• **C13** (`challenge-13-voting-sheet-{a,b}.csv`)<br>• **C14** (`challenge-14-fitness-test.csv`)<br>• **C22** (Proposed Network Tangle) | • **Pack Beta** (PII columns, duplicate event stages)<br>• **Pack Gamma** (Semantic status conflicts, silent cap row drops) | String nulls (`"NA"`, `"unknown"`) in custody columns; non-random missingness; duplicate case records fracturing graph topology; statutory turnaround tail breaches hidden by mean metrics. |
| **Computer Science** | • **#5** Screen Responsiveness<br>• **#7** Temporal Granularity Conflicts<br>• **#12** Cognitive Fatigue & Alert Storms<br>• **#16** Interactivity Overhead<br>• **#21** Streaming Latency & Jitter<br>• **#22** Legacy Tech Debt & Version Drift | • **C7** (`challenge-07-transport-dual-axis.csv`)<br>• **C10** (`challenge-10-canteen-queue.csv`)<br>• **C11** (`challenge-11-exam-results.csv`)<br>• **C16** (`challenge-16-alarm-log.csv`)<br>• **C18** (`challenge-18-bus-gps.csv`)<br>• **C19** (`challenge-19-prize-data.csv`)<br>• **C25** (Proposed Filter Maze) | • **Pack Alpha** (Mixed units °F vs °C, sensor outage as blank)<br>• **Pack Delta** (Alarm storm: 91% heartbeat noise vs 3% critical; ML explainability)<br>• **Pack Epsilon** (Network hairball: 74% noise edges) | p99 latency spikes (200× median) destroying linear scales; high-cardinality endpoint spaghetti; clock skew reversing event causality; invisible filter context leading to erroneous incident diagnosis. |
| **Nutrition Science** | • **#1** Uncertainty & Confidence Cones<br>• **#2** High-Dimensional Projection Loss<br>• **#8** Visual Literacy Deficit (Mean vs Median)<br>• **#9** Color Vision Deficiency (CVD)<br>• **#17** Static vs Dynamic Design Traps<br>• **#20** Unstructured Data & Sentiment | • **C1** (`challenge-01-attendance-hero-axis.csv`)<br>• **C4** (`challenge-04-canteen-budget.csv`)<br>• **C6** (`challenge-06-class-marks.csv`)<br>• **C9** (`challenge-09-room-usage.csv`)<br>• **C12** (`challenge-12-energy-readings.csv`)<br>• **C15** (`challenge-15-activity-map.csv`)<br>• **C17** (`challenge-17-feedback-sentiment.csv`) | • **Pack Alpha** (Confidence cone bounds breached 34% of time)<br>• **Pack Gamma** (Area-lies distortion: food desert pop vs physical zone area)<br>• **Pack Zeta** (Sparse matrix slices, sentiment dissonance) | Zero-inflation vs true zero in micronutrients; multi-order-of-magnitude skew (megadoses); unit discordance (per-serving vs per-100g); Simpson's Paradox hiding vulnerable cohort deficiency. |

---

## 3. Domain 1: Forensic Science

### 3.1 Context & Real-World Mission
In forensic investigation, data integrity is paramount. Data is collected across crime scenes, law enforcement precincts, forensic medical examiners, and ballistic/DNA labs. Missing data in forensic logs is rarely random; it often indicates administrative negligence, evidence tampering, or procedural statutory breaches.

### 3.2 Archetype Profiles (Choose One)
* **Profile A: Operational — Evidence Intake & Chain-of-Custody Monitor**
  * *Audience:* Evidence Vault Custodians & Lab Supervisors.
  * *Primary Question:* "Which evidence transfers are currently unverified, and what items are approaching the 30-day statutory testing limit?"
  * *Cadence:* Near real-time / daily intake stream.
* **Profile B: Analytical / Tactical — Suspect–Evidence–Location Link Network**
  * *Audience:* Detective Taskforce & Cold Case Investigators.
  * *Primary Question:* "What central brokers connect separate firearm offenses across jurisdictions, and what temporal clusters indicate coordinated activity?"
  * *Cadence:* Interactive ad-hoc query exploration.
* **Profile C: Strategic — Statewide Forensic Lab Throughput & Compliance Scorecard**
  * *Audience:* Department of Justice Executives & Judicial Oversight Committees.
  * *Primary Question:* "Are forensic backlog backlogs improving, and what percentage of criminal cases risk dismissal due to turnaround limit violations?"
  * *Cadence:* Monthly / Quarterly executive review.

### 3.3 Data Schema & Column Manifest
The seeded generator generates forensic data with the following schema:

```sql
CREATE TABLE forensic_evidence_stream (
    transfer_id        VARCHAR(20) PRIMARY KEY, -- e.g. "TXF-2026-9041"
    case_id            VARCHAR(20) NOT NULL,    -- e.g. "CASE-CR-4412" (Contains conflicting duplicates)
    evidence_type      VARCHAR(30) NOT NULL,    -- "Ballistics", "Biological/DNA", "Digital Media", "Narcotics"
    relinquishing_auth VARCHAR(50),             -- Officer / Lab Tech (Contains null-strings)
    receiving_auth     VARCHAR(50),             -- Custodial Officer
    transfer_timestamp VARCHAR(30) NOT NULL,    -- ISO-8601 or mixed format "DD/MM/YYYY HH:mm"
    statutory_deadline INT NOT NULL,            -- Maximum permissible processing days (e.g., 30)
    actual_turnaround  FLOAT,                   -- Turnaround in days (Contains extreme outliers & negatives)
    custody_seal_intact VARCHAR(10),            -- "YES", "NO", "UNCHECKED"
    jurisdiction_zone  VARCHAR(40),             -- Precinct / Regional Lab ID
    chain_gap_flag     INT                      -- 0 = intact, 1 = unverified transfer gap
);
```

### 3.4 Injected Traps & Diagnostic Challenges
1. **The Null-String Trap (C3 / C8 variant):** Unlogged handoffs do not contain native SQL `NULL`; they contain string literals: `""`, `"NA"`, `"unknown"`, `"PENDING"`, or `"-"`. Naive SQL queries (`WHERE relinquishing_auth IS NOT NULL`) pass them as valid personnel, masking critical gaps in custody.
2. **Conflicting Duplicate Case IDs (C13 variant):** The same `case_id` appears with conflicting evidence types or opposing jurisdictions. If naively grouped by `case_id`, rows merge incorrectly; if treated naively, a single physical suspect entity fractures into disconnected network vertices.
3. **The "Mean Masks Failure" Tail Trap (C6 / C1 variant):** The mean turnaround time is 21.4 days (safely below the 30-day statutory bar). However, the distribution is bimodal: 16% of cases experience turnaround times between 45 and 90 days. A dashboard that displays only the mean will report a green status while prosecutors are forced to drop felony cases.
4. **Format Inconsistency Breaking Relational Joins (C19 variant):** Dates alternate between `YYYY-MM-DDTHH:mm:ssZ` and `DD-MM-YYYY`. Joining or filtering on date intervals silently excludes 40% of records.

### 3.5 The 5 Mandatory Interactive Mechanisms in Forensic Science
* **Multi-Tab Architecture:**
  * *Tab 1 (Overview):* Statutory breach counters, chain-of-custody integrity index, evidence volume gauge.
  * *Tab 2 (Breakdown):* Turnaround distribution histogram (highlighting the >30 day tail), evidence type breakdown.
  * *Tab 3 (Detail):* Searchable evidence audit table with full custody log history.
  * *Filter Propagation:* Selecting a jurisdictional precinct on Tab 1 must filter the chain-of-custody alert table on Tab 3 and update the global breach rate KPI.
* **On-the-Fly Processing:** Re-evaluating custody risk levels and recalculating breach percentages client-side whenever the user adjusts the statutory threshold slider.
* **Cross-Linking / Linked Brushing:** Clicking an evidentiary category mark (e.g., "Biological/DNA") in a donut chart simultaneously highlights custody nodes in the **Network Graph** and filters the **Turnaround Timeline**.
* **Lossless Drill-Down & Roll-Up:**
  * *Hierarchy:* State Judicial Region (Level 1) $\to$ Jurisdictional Precinct (Level 2) $\to$ Case Evidence Item (Level 3).
  * *Roll-up Verification:* Collapsing Level 3 back to Level 1 must yield the exact statewide evidence count.
* **Graph Theory Integration:**
  * Vertices ($V$): Jurisdictional officers, evidence vaults, and external forensic labs.
  * Edges ($E$): Custody handoffs, weighted by handoff frequency.
  * Metric: **Degree Centrality** or **Betweenness Centrality**. Nodes with high betweenness represent critical bottleneck custodians whose absence stalls the entire judicial pipeline.

---

## 4. Domain 2: Computer Science & Systems Engineering

### 4.1 Context & Real-World Mission
Modern software platforms consist of hundreds of decoupled microservices communicating across distributed networks. Operations teams, SREs, and engineering leaders require telemetry interfaces to triage production outages, detect memory leaks, prevent dependency deadlocks, and allocate cloud resources efficiently.

### 4.2 Archetype Profiles (Choose One)
* **Profile A: Operational — Production Microservice Incident & APM Telemetry Stream**
  * *Audience:* Site Reliability Engineers (SREs) & On-Call DevOps Staff.
  * *Primary Question:* "Which service endpoint is causing upstream timeout cascades right now, and is the p99 latency breaching our SLA?"
  * *Cadence:* Real-time streaming / 5-second aggregation window.
* **Profile B: Analytical / Tactical — Service Dependency Topology & Call Graph Matrix**
  * *Audience:* Systems Architects & Platform Engineers.
  * *Primary Question:* "Where do circular dependencies or high-fan-out bottlenecks exist, and how does a failure in Service X propagate through the mesh?"
  * *Cadence:* Ad-hoc investigative exploration.
* **Profile C: Strategic — Engineering Health, DORA Metrics & Defect Escape Scorecard**
  * *Audience:* VP of Engineering & Enterprise CTO.
  * *Primary Question:* "Are our deploy frequencies increasing while MTTR and defect escape ratios decline, or are we accumulating crippling architectural tech debt?"
  * *Cadence:* Bi-weekly sprint / quarterly review.

### 4.3 Data Schema & Column Manifest
The seeded generator generates systems telemetry data with the following schema:

```sql
CREATE TABLE service_telemetry_mesh (
    trace_id           VARCHAR(36) PRIMARY KEY, -- UUID e.g. "a9f81c20-..."
    timestamp_utc      VARCHAR(30) NOT NULL,    -- ISO-8601 timestamp with clock skew
    caller_service     VARCHAR(40) NOT NULL,    -- Source node (e.g. "auth-gateway")
    target_service     VARCHAR(40) NOT NULL,    -- Destination node (e.g. "user-db-pool")
    endpoint_route     VARCHAR(80) NOT NULL,    -- URI route (100+ unique values: high cardinality)
    http_status        INT NOT NULL,            -- 200, 401, 404, 500, 503, 504
    latency_ms         FLOAT NOT NULL,          -- Execution duration (Contains 200x outliers)
    payload_bytes      INT NOT NULL,            -- Request size
    cpu_util_pct       FLOAT,                   -- Container CPU load (Contains missing values)
    memory_rss_mb      FLOAT,                   -- Resident set size memory
    deployment_version VARCHAR(20),             -- "v1.4.2", "v1.4.3", "v2.0-rc1" (Contains legacy defaults)
    error_severity     VARCHAR(10)              -- "info", "warn", "critical" (Alarm storm distribution)
);
```

### 4.4 Injected Traps & Diagnostic Challenges
1. **The Extreme Outlier / Hero Axis Trap (C1 / C7 variant):** 98% of API requests execute within 15–45 ms. However, garbage-collection pauses and deadlocks produce p99 latency spikes exceeding 12,000 ms. A standard linear Y-axis flattens all normal traffic into a useless 1-pixel baseline, hiding critical service regressions. Students must justify log scales or split-range threshold bands.
2. **The High-Cardinality "Spaghetti" Trap (C4 / C25 variant):** Over 120 distinct `endpoint_route` strings exist. A standard categorical bar chart produces an illegible wall of text. The dashboard must implement dynamic grouping, top-N filtering with an "Other" roll-up, or interactive faceted search.
3. **The Alarm Storm & Heartbeat Trap (C16 / Pack Delta variant):** 92% of records are routine `info` pings (`portal_ping`, `session_idle`). Exactly 3% are `critical` cascade timeouts. A dashboard lacking alert suppression or priority filtering will induce cognitive fatigue and blind operators to catastrophic outages.
4. **The Invisible Filter State Trap (C25 / PRD-1):** Users drill down into `target_service = 'billing-db'` on Tab 2, but forget that an upstream filter on Tab 1 (`http_status = 500`) remains active. The user concludes the database is failing entirely, unaware they are viewing only error traces. The UI must provide an unmistakable, persistent filter breadcrumb and propagation indicator.

### 4.5 The 5 Mandatory Interactive Mechanisms in Computer Science
* **Multi-Tab Architecture:**
  * *Tab 1 (Overview):* Cluster health status, global throughput (RPS), error rate gauge, active alert banner.
  * *Tab 2 (Breakdown):* Latency distribution curves (p50, p95, p99), endpoint cardinality matrix, service error contribution.
  * *Tab 3 (Detail):* Distributed trace waterfall explorer, raw log telemetry table.
  * *Filter Propagation:* Selecting an error code on Tab 1 must highlight correlated call paths on the Tab 2 Dependency Graph and filter the Tab 3 Trace Table.
* **On-the-Fly Processing:** Live recalculation of percentile latency (p90, p99) and moving error rates in client memory upon adjusting the time-window scrubber.
* **Cross-Linking / Linked Brushing:** Selecting an errant service node in the **Dependency Graph** highlights its temporal latency spikes on the **Telemetry Line Chart** and filters error codes on the **Status Code Bar Chart**.
* **Lossless Drill-Down & Roll-Up:**
  * *Hierarchy:* Kubernetes Service Cluster (Level 1) $\to$ Microservice Pod / Container (Level 2) $\to$ Individual Request Trace (Level 3).
  * *Roll-up Verification:* Rolling up from Level 3 to Level 1 must restore the exact cluster-wide request volume and cumulative bandwidth.
* **Graph Theory Integration:**
  * Vertices ($V$): Microservices and database clusters.
  * Edges ($E$): Directed RPC / HTTP requests, weighted by call volume or error rate.
  * Metric: **In-Degree Centrality** (services under heaviest upstream demand) or **Cycle Detection / Feedback Loops**. The calculated metric drives node color coding (e.g., nodes exceeding critical in-degree turn amber/red).

---

## 5. Domain 3: Nutrition & Metabolic Science

### 5.1 Context & Real-World Mission
Nutritional epidemiology, clinical metabolic wards, and public health agencies track dietary patterns to combat chronic disease, malnutrition, and metabolic disorders. Dietary records are notoriously noisy, characterized by extreme self-reporting bias, zero-inflated nutrient distributions, unit confusion, and demographic disparities.

### 5.2 Archetype Profiles (Choose One)
* **Profile A: Operational — Patient Dietary Adherence & Clinical Feeding Monitor**
  * *Audience:* Clinical Dietitians & Hospital Metabolic Care Teams.
  * *Primary Question:* "Which diabetic or post-operative patients have missed required meal intervals, and whose sodium intake exceeds clinical safety caps?"
  * *Cadence:* Daily inpatient monitoring feed.
* **Profile B: Analytical / Tactical — Nutrient Interaction & Food Desert Mapping**
  * *Audience:* Public Health Epidemiologists & Academic Researchers.
  * *Primary Question:* "What subpopulation clusters experience severe micronutrient deficiency despite adequate caloric intake, and how does regional food access drive this?"
  * *Cadence:* Multi-cohort observational study exploration.
* **Profile C: Strategic — Population Nutrition Security & Dietary Policy Scorecard**
  * *Audience:* Ministry of Health Officials & NGO Program Directors.
  * *Primary Question:* "Are fortified food initiatives closing the rural child iron-deficiency gap, or are national averages masking localized famine pockets?"
  * *Cadence:* Annual public health review.

### 5.3 Data Schema & Column Manifest
The seeded generator generates nutrition science data with the following schema:

```sql
CREATE TABLE dietary_intake_records (
    record_id          VARCHAR(20) PRIMARY KEY, -- e.g. "NUT-2026-1082"
    participant_id     VARCHAR(20) NOT NULL,    -- e.g. "PT-404"
    survey_date        VARCHAR(15) NOT NULL,    -- Date of logging
    demographic_cohort VARCHAR(30) NOT NULL,    -- "Urban-Affluent", "Rural-Agrarian", "Peri-Urban-Informal"
    meal_slot          VARCHAR(15) NOT NULL,    -- "Breakfast", "Lunch", "Dinner", "Snack"
    food_category      VARCHAR(30) NOT NULL,    -- "Legumes", "Leafy Greens", "Ultra-Processed", "Dairy"
    serving_quantity   FLOAT NOT NULL,          -- Quantity logged
    serving_unit       VARCHAR(20) NOT NULL,    -- "per-serving", "per-100g", "total-recipe" (Unit discordance)
    calories_kcal      FLOAT NOT NULL,          -- Energy content
    protein_grams      FLOAT NOT NULL,          -- Macronutrient
    sodium_mg          FLOAT NOT NULL,          -- Contains extreme outliers (>15,000 mg)
    vitamin_c_mg       FLOAT,                   -- 38% literal zeros vs NULL (Zero-inflation trap)
    is_fasting_period  INT NOT NULL             -- 0 = regular intake, 1 = prescribed fasting
);
```

### 5.4 Injected Traps & Diagnostic Challenges
1. **The Zero-Inflation vs. True Zero Trap (PRD-1 / C3 variant):** The `vitamin_c_mg` column features 38% literal `0.0` values. If treated as missing data and imputed, the dashboard invents vitamin consumption that never occurred; if treated naively as true clinical zeros during non-logging intervals, patients appear to suffer from acute scurvy. Students must cross-reference `is_fasting_period` and `serving_quantity` to discern structural zeros from missing entries.
2. **The Unit Discordance Trap (C12 / Pack Alpha variant):** The `serving_unit` column mixes `per-serving`, `per-100g`, and `total-recipe` quantities. A raw sum of sodium or protein produces nonsensical rankings where a family casserole recipe appears as a single person's toxic meal. Data must be normalized to standard 100g equivalents during preprocessing.
3. **Simpson's Paradox & Masked Subgroup Divergence (PRD-1 / C6 variant):** Across the overall population, mean nutritional adequacy index shows a positive 3% annual growth. However, disaggregating by `demographic_cohort` reveals that while the "Urban-Affluent" group improved by 14%, the "Peri-Urban-Informal" cohort suffered an 18% collapse in essential micronutrients. Aggregation actively conceals a public health emergency.
4. **Extreme Micronutrient Outliers (C1 / C15 variant):** Specific entries feature sodium values exceeding 25,000 mg (due to unparsed recipe totals or decimal entry errors). A standard linear axis compresses all normal healthy intake lines against the bottom axis border.

### 5.5 The 5 Mandatory Interactive Mechanisms in Nutrition Science
* **Multi-Tab Architecture:**
  * *Tab 1 (Overview):* Population caloric sufficiency gauge, acute deficiency alert counters, average dietary quality index.
  * *Tab 2 (Breakdown):* Micronutrient distribution boxplots, demographic cohort disparity matrices, meal slot distribution.
  * *Tab 3 (Detail):* Granular patient meal log inspector with flagged adherence breaches.
  * *Filter Propagation:* Selecting a demographic cohort on Tab 1 must update deficiency distributions on Tab 2 and filter patient audit logs on Tab 3.
* **On-the-Fly Processing:** Live recalculation of Recommended Daily Allowance (RDA) attainment percentages as user toggles between adult male, adult female, and child demographic baselines.
* **Cross-Linking / Linked Brushing:** Selecting a nutrient category mark (e.g., "Ultra-Processed") in a food category chart brushes caloric contribution on the **Macronutrient Timeline** and highlights corresponding demographic groups on a **Deficiency Scatter Plot**.
* **Lossless Drill-Down & Roll-Up:**
  * *Hierarchy:* Regional Zone (Level 1) $\to$ Demographic Household Cohort (Level 2) $\to$ Individual Patient Meal Record (Level 3).
  * *Roll-up Verification:* Rolling up from Level 3 to Level 1 must precisely restore the total regional caloric and protein aggregate.
* **Graph Theory Integration:**
  * Vertices ($V$): Specific food items and nutrient vectors.
  * Edges ($E$): Co-ingestion frequency within the same meal slot.
  * Metric: **Community Detection (Modular Clustering)** or **Degree Centrality**. Clustering identifies distinct dietary patterns (e.g., traditional whole foods vs. Western ultra-processed convenience diets).

---

## 6. Synthesis Matrix: Comparative Domain Reference

Use this master reference to evaluate architectural trade-offs across the three domains:

| Architectural Dimension | Forensic Science | Computer Science | Nutrition Science |
| :--- | :--- | :--- | :--- |
| **Primary Domain Mission** | Evidentiary integrity, legal compliance, chain-of-custody tracking. | Microservice reliability, latency control, dependency management. | Public health nutrition, metabolic safety, demographic dietary equity. |
| **Data Cadence** | Batch event transfers with statutory deadlines (days). | High-frequency telemetry streams & request traces (ms). | Daily / per-meal dietary logs with cumulative dietary windows. |
| **Injected Data Trap** | String nulls (`"NA"`), non-random missingness, duplicate case records. | p99 extreme outliers (200×), high-cardinality URIs, clock skew. | Zero-inflation vs true zero, unit discordance (serving vs 100g), extreme skew. |
| **Primary Visual Failure Mode** | Aggregation hides tail cases breaching statutory 30-day limits. | Linear scale flattens latency signal; high-cardinality spaghetti chaos. | Simpson's Paradox: aggregate stability masks subgroup starvation. |
| **Graph Vertices ($V$)** | Suspects, officers, evidence vaults, forensic labs. | Microservices, database clusters, network nodes. | Food items, nutrients, dietary categories. |
| **Graph Edges ($E$)** | Custody handoffs, case co-occurrences. | Directed RPC calls, HTTP requests, dependency links. | Co-ingestion in meals, nutrient substitution. |
| **Computed Graph Metric** | Betweenness Centrality (identifies bottleneck custodians). | In-Degree Centrality / Cycle Detection (identifies overwhelmed dependencies). | Community Modularity (identifies distinct dietary habit clusters). |
| **Drill-Down Hierarchy** | Judicial Region $\to$ Precinct $\to$ Case Evidence Item. | Kubernetes Cluster $\to$ Pod/Service $\to$ Request Trace. | Geographic Region $\to$ Demographic Cohort $\to$ Meal Log. |
| **Lossless Roll-Up Contract** | Total regional evidence items and pending breach counts. | Total cluster request throughput (RPS) and aggregate payload. | Total regional caloric intake and cumulative nutrient sum. |

---

## 7. Student Selection & Execution Protocol

When beginning the Project Work, each student or pair must follow this binding protocol:

1. **Domain Declaration:** Formally declare one domain (**Forensic**, **CS**, or **Nutrition**) and one operational archetype (**Operational**, **Analytical**, or **Strategic**) during Gate 0.
2. **Seed Generation:** Input Student ID into the seeded generator to receive the domain-specific raw dataset.
3. **Trap Discovery Log:** In Gate 1, use the embedded `sql.js` workbench to locate and prove the presence of the domain-specific traps defined in this document.
4. **Defensive Preprocessing:** In Gate 2, implement a cleaning pipeline that neutralizes the traps without destroying domain information (e.g., null-banding in Forensics, log-scaling in CS, unit harmonization in Nutrition).
5. **Interactive Build:** In Gate 3, construct the multi-tab interactive dashboard satisfying all five interaction requirements tailored to the chosen domain semantics.
6. **Live Curveball Readiness:** Ensure the dashboard's client-side data loader can ingest an unseen `_v2_curveball.csv` file live during the presentation without crashing or reverting to static fallbacks.

---

**End of Domain Scoping Specification.**
