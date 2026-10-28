# Grill Me Dashboard — Tutorial Validation Implementation

End-to-end validation build of the Aplly.xyz tutorial
**"Data Visualization Architecture: Matt Pocock's Grill Me Method & Drift-Proof Evaluation Frameworks"**
(Part 7 of the Data Visualization Architecture Series, by Puneet Arora).

The tutorial teaches a pipeline: **Grill Me interview → locked Spec Doc → gated code generation → automated headless verification**. This repo implements every stage and validates the result. See **[VALIDATION.md](VALIDATION.md)** for the full validation report (including grader defects found and fixed).

## Layout

```
prompts/system_prompt_grill_me.md    §2  Grill Me system prompt (verbatim)
prompts/code_generation_prompt.md    §4  Code generation prompt (verbatim)
specs/DASH-SPEC-2026-081.md          §3  Master Spec Doc (verbatim)
dashboard/index.html                     Reference implementation (built from the Spec Doc)
grader/grader.js                         Tutorial grader (verbatim)
grader/grader.v2.js                      Hardened grader (fixes F2–F4 in VALIDATION.md)
VALIDATION.md                            Validation report & test evidence
```

## Run it

```powershell
npm install                       # installs jsdom (undocumented prerequisite of the tutorial grader)
npm run grade                     # tutorial grader on the dashboard   -> 4/4 gates
npm run grade:v2                  # hardened grader on the dashboard   -> 4/4 gates
start dashboard/index.html        # open the live dashboard in a browser
```

The dashboard simulates the Spec's 100 Hz IoT feed aggregated into 5-second
tumbling windows: KPI cards (F-top), fleet selector (F-left), canvas trend
chart with Okabe-Ito thresholds ● ▲ 🛑 and a null-telemetry hatch band (F-mid),
and a paginated severity-sorted anomaly log (bottom).

## Git

Initialized and committed on branch `main`, remote:
https://github.com/ecologictribe/grill-me-dashboards.git
