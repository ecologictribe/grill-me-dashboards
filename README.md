# Grill Me Dashboard — Tutorial Validation + Teaching Series

End-to-end validation build of the Aplly.xyz tutorial
**"Data Visualization Architecture: Matt Pocock's Grill Me Method & Drift-Proof Evaluation Frameworks"**
(Part 7 of the Data Visualization Architecture Series, by Puneet Arora) — now
also the home of the **"Data Visualization Challenges, Decoded"** teaching
series, its **class assignment**, and the **synthetic datasets** that feed it.

The validated pipeline: **Grill Me interview → locked Spec Doc → gated code
generation → automated headless verification**. See
**[VALIDATION.md](VALIDATION.md)** for the full validation report (including
grader defects found and fixed).

## Layout

```
prompts/system_prompt_grill_me.md    §2  Grill Me system prompt (verbatim)
prompts/code_generation_prompt.md    §4  Code generation prompt (verbatim)
specs/DASH-SPEC-2026-081.md          §3  Master Spec Doc (verbatim)
dashboard/index.html                 Reference implementation (from the Spec Doc)
grader/grader.js                     Tutorial grader (verbatim)
grader/grader.v2.js                  Hardened grader (Assignment 2 DASH-SPEC)
grader/grader.v3.js                  Behavioral & layout-agnostic grader (Assignment 3)
self-grade.bat / self-grade.sh       Assignment 2 zero-setup wrappers (grader.v2.js)
self-grade-v3.bat / self-grade-v3.sh Assignment 3 zero-setup wrappers (grader.v3.js)
eval-tool/index.html                 BROWSER EVAL TOOL — drop your dashboard
                                     HTML here: sandboxed iframe, v3 (Assignment 3)
                                     & v2 (Assignment 2) gate profiles, copy-ready
                                     report + Scorecard tab.
red-team-tool/index.html             RED-TEAM AUDIT CARD TOOL — Assignment 3 Phase 3
                                     worked example, For/By Team SHA-256 seals,
                                     locked #rt= handshake & Page 7 patch log.
presentation-tool/index.html         PRESENTATION SCORECARD — live peer rubric
                                     for 20 Nov Live Curveball & 5 Nov viva:
                                     7 dimensions, Curveball outcome, shareable
                                     SHA-256 scorecard.

challenges/challenges.txt            MASTER CHALLENGE DATASET — 22 failure modes
                                    (Part A, annotated with coverage) + 20 case
                                    challenges C1–C20 (Part B) + 7 open proposals
                                    C21–C27 (Part C) + contribution template
                                    (Part D)

tutorials/                           "Data Visualization Challenges, Decoded":
    index.html                           Series hub
    grill-method.html                    0 · The Challenge-Grill Method (start here)
    part-1..4.html                       1–4 · All 22 failure modes + grill step
                                         + Gate 0 + self-grading rubrics

assignments/index.html               ASSIGNMENT 2 (29 Oct – 5 Nov 2026, completed):
                                    pick 3 of 20 cases → 3 reports → eflow PDF
                                    → presentation.
assignments/assignment-3.html        ASSIGNMENT 3 (13 Nov – 20 Nov 2026, active):
                                    AI Autopsy, Peer Red-Team & Live Curveball
                                    Defense. 1 unlabeled Mystery Pack (Alpha–Zeta)
                                    → naive AI autopsy → dynamic CSV + Custom Gate
                                    #5 → Red-Team handshake → live _v2_curveball
                                    swap on 20 Nov.
assignments/ASSIGNMENT-3-PROPOSAL.md Design proposal & rubric rationale for A3.
assignments/data/                    6 seeded Assignment 3 Mystery Packs
                                    (a3-pack-{alpha..zeta}.csv) + 25-pair
                                    non-reciprocal Red-Team ring roster.

datasets/                            21 synthetic CSVs — one trap-laden dataset
    index.html                           per case challenge + themed catalog
    README.md                            Dataset docs & rules
    challenge-NN-*.csv                   Seeded, fictional, classroom-safe

scripts/generate-datasets.js         Seeded generator (seed 20261029) — rerun
                                     to reproduce byte-identical CSVs
scripts/generate-a3-datasets.js      Assignment 3 generator (seed 20261113);
                                     pass `--curveball <seed>` (trainer-only)
                                     to write hidden v2 files to var/a3-curveballs/

article/index.html                   Part 8 interactive article (validation
                                     findings, grader simulator)
VALIDATION.md                        Validation report & test evidence
CONTEXT.md                           Project memory — domain model, state,
                                     conventions for future sessions
```

## Run it

```powershell
npm install                       # installs jsdom (prerequisite of the graders + probe)
npm run grade                     # tutorial grader on the dashboard   -> 4/4 gates
npm run grade:v2                  # hardened grader on the dashboard   -> 4/4 gates
node scripts/generate-datasets.js # regenerate Assignment 2 datasets/
node scripts/generate-a3-datasets.js # regenerate Assignment 3 packs (Alpha-Zeta)
node scripts/generate-a3-datasets.js --curveball 20261120 # trainer-only v2 CSVs (var/)
node .quarantine/validate-tutorials.js   # full content probe (pages + datasets)
node .quarantine/validate-eval-tool.js   # eval-tool v2 parity + sandbox isolation
start dashboard/index.html        # open the live dashboard in a browser
```

The dashboard simulates the Spec's 100 Hz IoT feed aggregated into 5-second
tumbling windows: KPI cards (F-top), fleet selector (F-left), canvas trend
chart with Okabe-Ito thresholds ● ▲ 🛑 and a null-telemetry hatch band (F-mid),
and a paginated severity-sorted anomaly log (bottom).

## For students

### Assignment 3 (Active: 13 Nov – 20 Nov 2026)
1. Open `assignments/assignment-3.html` and pick/receive 1 Mystery Pack (`Alpha–Zeta`).
2. Run a 1-prompt **Naive AI Autopsy** (expose ≥3 failures), then Grill → Spec → build a dynamic CSV dashboard (HTML default, or Power BI with `pCsvPath` parameter) + **Custom Gate #5**.
3. Self-grade with `eval-tool/index.html` (**v3** profile) or `self-grade-v3.bat` / `self-grade-v3.sh`.
4. Swap with your Red-Team partner (`assignments/data/a3-pairing-roster.md`) using `red-team-tool/index.html` (`#rt=` handshake + Page 7 patch seal).
5. Submit `RollNo_Name_Assignment3.pdf` on eflow by **20 Nov 2026** and survive the live `_v2_curveball.csv` swap on stage (peers score via `presentation-tool/index.html`).

### Assignment 2 (Completed: 29 Oct – 5 Nov 2026)
1. Start at `tutorials/index.html` → **The Challenge-Grill Method**, pick 3 of 20 challenges from `assignments/index.html`, and self-grade via `eval-tool/index.html` (**v2** profile) or `self-grade.bat` / `self-grade.sh`.

## Hosting — GitHub Pages (static)

The whole repo is a static site. A **GitHub Actions workflow**
(`.github/workflows/pages.yml`) deploys `main` to **GitHub Pages** on every
push: the root [`index.html`](index.html) is the landing hub linking the five
entry points (tutorials, assignment, datasets, article, reference dashboard).

One-time setup (repo owner): **Settings → Pages → Build and deployment →
Source: "GitHub Actions"**. After that, every push to `main` republishes at:

```
https://ecologictribe.github.io/grill-me-dashboards/
```

The workflow runs the content probe before deploying, so a broken page or
missing dataset can't ship silently.

## Git

Branch `main`, remote:
https://github.com/ecologictribe/grill-me-dashboards.git

**Release tag: `v1.0.0`** — the teaching suite exactly as issued on
29 Oct 2026 (tutorial series, assignment, 21 datasets, challenge bank,
hosting). Future edits get new tags; `v1.0.0` remains the recoverable
issued snapshot. Browsing it: https://github.com/ecologictribe/grill-me-dashboards/releases/tag/v1.0.0
