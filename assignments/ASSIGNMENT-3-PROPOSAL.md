# Assignment 3 Proposal — "AI-Native, Anti-Shortcut" Edition

**Course:** Data Visualization Architecture (`grill_me_dashboard`)  
**Author / Trainer:** Puneet Arora (Aplly.xyz)  
**Predecessor:** Assignment 2 (`assignments/index.html` — *3 of 20 Challenges: Grill → Spec → Build → Self-Grade → Present*)  
**Status:** Draft Proposal for Trainer Review

---

## 1. Diagnosis: What Assignment 2 Proved (and the Next Gap to Close)

Assignment 2 solved the biggest classroom failure mode in the AI era: **forcing students to present live** (otherwise marked *Incomplete*) stopped students from treating the assignment as a 5-minute copy-paste PDF exercise. When you must stand up for 5–7 minutes, point to pixels, cite Spec decisions (`D1…Dn`), and defend `|Self − Trainer|` in front of peers using `presentation-tool/index.html`, you are forced to learn and act.

However, Assignment 2 still gave students three structural crutches that AI can exploit easily:
1. **Named Traps:** Every challenge card (`C1–C20`) told students *what* the trap was before they even opened the CSV (e.g., *"C3 · Missing Tuesday: sensor outage rendered as zero"*). A student could paste the card + CSV into an LLM and ask it to generate both the Grill interview and the fixed HTML.
2. **Static, Single-Shot Data:** Once the HTML rendered the provided CSV cleanly, nothing tested whether the dashboard logic was genuinely data-driven or hardcoded by AI to look right on one screenshot.
3. **Gate Consumer Only:** Students ran `eval-tool/index.html` / `grader/grader.v2.js` without having to *author* a single verification rule themselves.

### Design Goal for Assignment 3
> **Do NOT ban AI. Make AI a mandatory collaborator — and design the workflow so that naive AI usage visibly breaks, while thoughtful AI + human engineering wins.**

---

## 2. Three Ways to Structure Assignment 3

### Option 1 (Recommended): "The AI Autopsy, Red-Team & Live Curveball Defense"
*Builds directly on Assignment 2's pipeline and unlocks the 6–7 uncovered failure modes in `challenges/challenges.txt` Part C (`C21–C26`).*

Instead of building 3 small greenfield dashboards from labeled cards, each student (or pair) completes **1 deep end-to-end "Audit → Harden → Defend" cycle** on an **unlabeled, multi-trap dataset** (containing 3 hidden failure modes, with no hint on the card):
1. **Stage 1 — Naive AI Autopsy (Mandatory Failure Log):** Feed the raw dataset to any AI with a basic 1-line prompt (*"Create an executive dashboard for this CSV"*). Save/screenshot the AI's output, then **diagnose every lie, distortion, and silent bug the AI produced** (mapping each to the 22 failure modes).
2. **Stage 2 — Grill, Spec & Hardened Rebuild (+ 1 Custom Gate):** Run the Challenge-Grill Method to fix all discovered traps, build the hardened HTML (default) or Power BI (+bonus) dashboard, and **write 1 new boolean verification gate** (JS function or verifiable Power BI checklist rule) targeting a Part C failure mode (`C21–C26`, e.g., uncertainty cones or `C26 · The Auto-Chart Fumble`).
3. **Stage 3 — Peer Red-Team Audit (Pre-Submission):** Before final submission, each student/pair swaps dashboards with an assigned **Red-Team Reviewer**. The Red Team tries to break the dashboard (screen resize, CSV edge cases, CVD simulator, deceptive scales) and files a 1-page **Bug/Drift Bounty Report** (+bonus marks for verified bugs found).
4. **Stage 4 — Live "Dirty Data Swap" Presentation (Gate to Complete):** On presentation day, the trainer drops a **Surprise `_v2_curveball.csv`** (same columns, new traps: extra null outage, 1,500+ rows, reversed category order, extreme outlier, or unit drift). The student must load `_v2_curveball.csv` **live on stage** and answer 1 Red-Team / Trainer viva question. **No live presentation + live data swap = Incomplete.**

**Why AI cannot solve this in 5 minutes:**
- AI does not know which 3 traps are hidden in the unlabeled CSV until the student inspects the data and interrogates it.
- Hardcoded AI HTML/charts break immediately during the live `_v2_curveball.csv` swap.
- Peer Red-Teaming punishes sloppy AI defaults *before* the trainer even grades.

---

### Option 2: "Real-World Stakeholder & Field Audit"
*Zero synthetic CSVs from the course repo — students go into the wild.*

- **Task:** Pick a real public dataset (city transit, campus mess/attendance, hospital/weather open data, or a real corporate/media chart that went viral for the wrong reasons).
- **Human-Only Grill:** Students must interview a **real human stakeholder** (another student, faculty member, club lead, or shop owner) as the dashboard user and submit a signed/recorded 5-minute Grill summary — AI can help draft questions, *not* fabricate the stakeholder's answers.
- **Deliverable:** Original broken chart/table audit + Grill transcript + Spec Doc + Live HTML/Power BI rebuild + 6-minute presentation explaining what changed after talking to a real user.

**Pros:** Strong real-world empathy; impossible to copy-paste from existing repo datasets.  
**Cons:** Harder to standardize grading across 50 completely different datasets; harder to do a uniform live data swap on presentation day.

---

### Option 3: "Become the Challenge Author (`C21–C26` Builder Sprint)"
*Directly turns `challenges/challenges.txt` Part C into student-built course assets.*

- **Task:** Assign teams to the 7 uncovered Part A failure modes (`C21` Uncertainty, `C22` Networks, `C23` Geospatial Distortion, `C24` ML Explainability, `C25` Interactivity Overhead, `C26` Auto-Chart Context Stripping, `C27` 3D/Spatial).
- **Deliverable:** Each team acts as a *trap designer*:
  1. Write a realistic synthetic dataset generator (or CSV) that **subtly embeds the failure mode** without looking obviously fake.
  2. Prove the trap works by showing how a standard chart / naive AI prompt falls for it.
  3. Build the Spec Doc + reference solution + automated verification gate.
  4. On presentation day, **challenge another team live** to diagnose the trap in 3 minutes.

**Pros:** Deepest conceptual mastery ("you only understand a trap when you can engineer one"); enriches the repo with `C21–C26`.  
**Cons:** Higher technical barrier for non-coding students unless paired carefully.

---

## 3. Recommended Blueprint: Option 1 ("AI Autopsy + Red-Team + Live Curveball")

Below is the complete, ready-to-adapt structure for issuing **Assignment 3** in the same style as `assignments/index.html`.

### 3.1 Five Non-Negotiable Rules (How AI Is Permitted & Policed)

| Rule | What Students Can Do With AI | What Forces Real Learning & Action |
| :--- | :--- | :--- |
| **1. Unlabeled Mystery CSV** | Ask AI to profile columns, suggest EDA checks, and help write JS/DAX. | The assignment sheet gives **no trap list**. Students must inspect rows, find the 3 embedded traps themselves, and name them in the declaration. |
| **2. Mandatory AI Autopsy** | Generate a naive "zero-grill" AI dashboard first. | Students must **expose and document 3+ specific failures** in that AI output before moving to Phase 2. |
| **3. Dynamic File Loader Required** | Use AI to write a CSV upload/drop parser (`<input type="file">` or Power BI parameter). | **Hardcoded data arrays = automatic 0 on Gate B2.** The dashboard must accept any schema-matching CSV dropped in live. |
| **4. Peer Red-Team Bounty** | Use AI to test edge cases on their own build. | A classmate (incentivized by **+5 bounty marks**) audits the live artifact and logs every hidden flaw before submission. |
| **5. Live Curveball Presentation** | Prepare talking points and rehearse with AI. | **Incomplete unless presented.** Must drop the trainer's unseen `_v2_curveball.csv` live during the 6-min slot and survive 2 viva questions. |

---

### 3.2 Suggested 1-Week / 10-Day Timeline (Class of ~50)

| Day | Milestone | Action Required |
| :--- | :--- | :--- |
| **Day 1** | Assignment Issued + Dataset Assigned | Each student/pair receives 1 **Unlabeled Mystery CSV** (from 4–5 rotating multi-trap packs, so neighbors don't all have identical data). |
| **Day 2–3** | **Phase 1: AI Autopsy** | Run naive 1-prompt AI build → save screenshot → inspect raw CSV → submit **Trap Discovery & AI Autopsy Log** (name the 3 suspected failure modes). |
| **Day 4–6** | **Phase 2: Grill → Spec → Build → Custom Gate** | Run ≥3 Grill rounds → lock Spec Doc (`D1…Dn`) → build HTML (with live CSV drop-zone) or Power BI → pass `eval-tool` gates + write **1 custom boolean gate**. |
| **Day 7–8** | **Phase 3: Peer Red-Team Swap** | Pair A tests Pair B's artifact against edge cases, mobile viewport, CVD, and adversarial CSV rows → issues **Red-Team Audit Card** (1 page). Pair A patches defects & logs fixes. |
| **Day 9** | **Submit Single PDF (`eflow`)** | Submit `RollNo_Name_Assignment3.pdf` + runnable HTML/PBIX bundle on `eflow`. Fill Self-Scorecard (Trainer column blank). |
| **Day 10** | **Presentation & Live Curveball Day** | 6–7 min per student/pair: **(a)** AI Autopsy highlight, **(b)** Live `_v2_curveball.csv` drop-in test, **(c)** Red-Team fix defense, **(d)** Viva. Peers score live via `presentation-tool/index.html`. |

---

### 3.3 Mystery Multi-Trap Dataset Ideas (Using Uncovered `C21–C26` + Classic Traps)

To prevent copying across a class of 50, create **4–5 Mystery Packs** (extendable in `scripts/generate-datasets.js`). Each CSV mixes **3 traps** without labeling them:

- **Pack Alpha — "The Deceptive Campus Forecast"**
  - *Hidden Traps:* `C21` Uncertainty band drawn as hard safe line + `C3` Outage-as-zero + `C12` Hover-only units.
  - *Live Curveball (`_v2`):* Adds a week with 40% missing sensor rows and widens the confidence interval 3×.
- **Pack Beta — "The Generative BI Sports/Exam Summary"**
  - *Hidden Traps:* `C26` Auto-Chart value/bar-height mismatch or misleading sort + `C6` Mean vs. Median skew + `C14` Student PII names exposed in raw table.
  - *Live Curveball (`_v2`):* Introduces an extreme outlier row (skewing mean +18 points) and renames two IDs to look like real student names.
- **Pack Gamma — "The Zonal Hostel & Canteen Resource Map"**
  - *Hidden Traps:* `C23` Area-lies distortion (large low-density zone vs. dense hostel) + `C13` Semantic conflict across two sheets (gross vs. net counts) + `C8` 1,250 rows crossing a 1,000-row silent cap.
  - *Live Curveball (`_v2`):* Doubles rows to 2,100 and swaps the sort order of Zone A and Zone D.
- **Pack Delta — "The Student Risk & Alert Monitor"**
  - *Hidden Traps:* `C24` Black-box ML risk flags with no human-readable explanation + `C16` Alarm storm (noise flooding 3 critical alerts) + `C2/C9` Red/Green color-only severity.
  - *Live Curveball (`_v2`):* Changes threshold distribution so 80% of alerts are low-priority noise and adds a new severity label `CRITICAL_PENDING`.

---

### 3.4 Single PDF Blueprint (`RollNo_Name_Assignment3.pdf` → `eflow`)

1. **Page 1 — Cover, AI Tool Disclosure & Trap Discovery Claim:** Student info, assigned Pack ID, list of AI tools/models used, and the **3 traps discovered** (with row/column evidence from the raw CSV).
2. **Pages 2–3 — Naive AI Autopsy:** Screenshot of the 1-prompt AI dashboard + annotated callouts of every flaw (misleading scale, silent truncation, missing uncertainty, PII leak, etc.).
3. **Pages 4–5 — Grill Rounds & Locked Spec Doc (`D1…Dn`):** ≥3 dependent Grill rounds + numbered decisions + **1 Custom Gate** definition (boolean logic + why existing 4 gates weren't enough).
4. **Page 6 — Hardened Dashboard & Automated Gate Proof:** Desktop + mobile/print screenshots + `eval-tool/index.html` 4/4 output + Custom Gate pass proof.
5. **Page 7 — Peer Red-Team Audit & Patch Log:** The Red-Team card received from your assigned reviewer + what you actually fixed in response (before/after).
6. **Page 8 — Self-Evaluation Scorecard:** Printed from the assignment scorecard (Self filled, Trainer blank).

---

### 3.5 Proposed 100-Mark Rubric (Rebalancing Effort Toward Investigation & Live Action)

| Section | Focus | Max Marks | Key Change from Assignment 2 |
| :--- | :--- | :---: | :--- |
| **A · Investigation & AI Autopsy** | Trap discovery accuracy (finding all 3 hidden traps with CSV row proof) + Naive AI Autopsy quality + Grill/Spec discipline (`D1…Dn`) | **25** | Rewards *finding* bugs rather than building from a spoon-fed prompt. |
| **B · Engineering, Dynamic Data & Custom Gate** | Passes 4 baseline gates **AND** accepts dynamic CSV drop-in (no hardcoded arrays) **AND** implements 1 working Custom Gate | **25** | Hardcoded AI HTML fails immediately here. |
| **C · Honesty & Red-Team Rigor** | `|Self − Trainer| ≤ 3` honesty score (**10**) + quality of the Peer Red-Team audit you performed on a classmate's work (**10**) | **20** | Makes every student a critical auditor, not just a builder. |
| **D · Live Curveball Presentation & Viva** | **Mandatory to pass/complete:** Live `_v2_curveball.csv` drop-in works cleanly (**12**) + AI-vs-Hardened walkthrough (**8**) + Viva defense of Red-Team/Trainer questions (**10**) | **30** | Presentation weight raised from 10 → 30 (with live data swap). **No presentation = Incomplete.** |
| **E · Bonus (Optional)** | Power BI dynamic M/parameter rebuild (**+3**) OR verified high-severity bug caught during Red-Team audit (**+2**, max +5) | **(+5)** | Preserves Power BI bonus while rewarding sharpest auditors. |
| **TOTAL** | Pass mark: **60/100** · Seal of Honour: **≥ 85** with `|Self − Trainer| ≤ 3` | **100 (+5)** | |

---

### 3.6 Red Team Playbook — Definition, Formation, Composition & Duties

- **Definition:** A **Red Team** is an independent adversarial audit group tasked with challenging assumptions, injecting edge-case data, and proving where a dashboard misleads or breaks *before* submission. Every pair wears two hats: **Blue Team** (builder on their own pack) and **Red Team** (auditor on another pair's pack).
- **Formation (Cross-Pack, Non-Reciprocal Ring):** Pairs are matched across *different* Mystery Packs (`Alpha ↔ Beta`, `Gamma ↔ Delta`) in a directed ring (`A → B → C → A`) so there is zero shared code and no mutual-favour grading.
- **Composition (2 Hats):**
  1. **Data & Logic Challenger (CSV Breaker):** Mutates CSV rows (outage blanks, >1,000 rows, extreme outliers, reversed row order) to detect hardcoded arrays and broken math.
  2. **Visual & Governance Auditor (Trap Hunter):** Checks 375px mobile & print views, colourblind (CVD) legibility, PII exposure, and Spec-to-Pixel drift (`D1…Dn`).
- **Five Mandatory Duties (`R1–R5`):**
  1. **`R1` Cold Black-Box Run:** Open the artifact without coaching; verify offline execution and zero console errors.
  2. **`R2` Adversarial CSV Injection:** Drop a mutated CSV into the live loader and record whether charts and Custom Gate #5 update accurately.
  3. **`R3` Spec-to-Pixel Drift Audit:** Verify every promised Spec decision (`D1…Dn`) is visibly enforced on screen.
  4. **`R4` Issue Signed 1-Page Red-Team Audit Card:** File reproducible defects (`High/Med/Low`) with screenshots by **19 Nov** (*"Looks great" earns 0/10 on `C2`*).
  5. **`R5` Blue-Team Patch & Rebuttal:** Patch verified bugs with before/after proof on Page 7 of the PDF (plus +2 Bounty Bonus `E2` for catching verified High-Severity flaws).

---

## 4. Implementation Checklist (If You Approve Option 1)

If you decide to adopt **Option 1**, here is the minimal set of repo updates needed to launch Assignment 3 cleanly:
1. **`scripts/generate-datasets.js`:** Add 4–5 unlabeled multi-trap generators (`assignment3-pack-alpha.csv` … `delta.csv`) **plus** matching hidden `_v2_curveball.csv` files (kept trainer-only until presentation day!).
2. **`eval-tool/index.html`:** Add a small **"Custom Gate / CSV Swap Check"** section (or instructions for students to include a `<input type="file">` CSV loader in their HTML).
3. **`assignments/assignment-3.html`:** Clone the `assignments/index.html` template (Aplly.xyz theme, sticky TOC, countdown, Self-Scorecard with SHA-256 fingerprint seal, `eflow` checklist) updated for the 4-stage AI Autopsy → Red-Team → Live Curveball flow.
4. **`presentation-tool/index.html`:** Add a 1-click **"Live Curveball Survived? (Pass / Broke / Hardcoded)"** toggle alongside the 7 existing dimensions.
5. **`challenges/challenges.txt`:** Promote adopted `C21–C26` cases from Part C → Part B once datasets are generated.
