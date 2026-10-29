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
grader/grader.v2.js                  Hardened grader (fixes F2–F4 in VALIDATION.md)

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

assignments/index.html               THE CLASS ASSIGNMENT (issued 29 Oct 2026,
                                    due 5 Nov 2026): pick 3 of the 20 cases →
                                    3 reports → one PDF on eflow → presentation.
                                    Power BI bonus. Self/trainer scorecard.

datasets/                            21 synthetic CSVs — one trap-laden dataset
    index.html                           per case challenge + themed catalog
    README.md                            Dataset docs & rules
    challenge-NN-*.csv                   Seeded, fictional, classroom-safe

scripts/generate-datasets.js         Seeded generator (seed 20261029) — rerun
                                     to reproduce byte-identical CSVs

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
node scripts/generate-datasets.js # regenerate datasets/ (deterministic)
node .quarantine/validate-tutorials.js   # full content probe (pages + datasets)
start dashboard/index.html        # open the live dashboard in a browser
```

The dashboard simulates the Spec's 100 Hz IoT feed aggregated into 5-second
tumbling windows: KPI cards (F-top), fleet selector (F-left), canvas trend
chart with Okabe-Ito thresholds ● ▲ 🛑 and a null-telemetry hatch band (F-mid),
and a paginated severity-sorted anomaly log (bottom).

## For students

1. Start at `tutorials/index.html` → **The Challenge-Grill Method**.
2. Pick 3 of the 20 challenges from `assignments/index.html`.
3. Download their CSVs from `datasets/` (GitHub folder or the catalog page).
4. Grill → spec → build (Power BI or HTML) → self-grade → submit one PDF to
   eflow by 5 Nov 2026 → present.

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
