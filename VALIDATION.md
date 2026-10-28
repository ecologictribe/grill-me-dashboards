# Tutorial Validation Report — DASH-SPEC-2026-081

**Tutorial:** "Data Visualization Architecture: Matt Pocock's Grill Me Method & Drift-Proof Evaluation Frameworks" (Aplly.xyz, Part 7 of the Data Visualization Architecture Series)
**Source:** https://aplly.xyz/uploads/tutorials/6ae17d0187a7e_1793162497.html
**Validated on:** 2026-08-21
**Method:** Full end-to-end implementation of every tutorial artifact, then adversarial testing of the automated grader.

---

## 1. Executive Summary

The tutorial's core methodology (Grill Me interview → locked Spec Doc → gated code generation → automated verification) **works end-to-end and was implemented successfully**. The reference dashboard passes all four verification gates (`4 / 4`) under both the tutorial's original grader and a hardened version.

However, **the tutorial's grader as published cannot run without an undocumented dependency, and two of its four gates produce false positives** — a non-CVD-compliant dashboard and a "DOM bomb" that injects 3,000 nodes at runtime both score a perfect `4 / 4`. These are demonstrated, reproducible defects (§4). A hardened `grader.v2.js` fixes all three issues and is included in this repo.

**Verdict:** Tutorial methodology: ✅ validated. Tutorial grader: ⚠️ needs the corrections in §5 before it should be used for real student/AI evaluation.

---

## 2. What Was Implemented (Validation-by-Build)

| Tutorial Section | Artifact | Status |
| --- | --- | --- |
| §2 Grill Me system prompt | `prompts/system_prompt_grill_me.md` | ✅ Reproduced verbatim; drives the frontier interview correctly |
| §2 Frontier dialogue → decisions | Decisions captured in the Spec Doc | ✅ Both rounds (Pipeline/Aggregation, Layout/CVD) traceable to Spec §1–§4 |
| §3 Master Spec Doc | `specs/DASH-SPEC-2026-081.md` | ✅ Reproduced verbatim |
| §4 Code generation prompt | `prompts/code_generation_prompt.md` | ✅ Reproduced verbatim; pre-generation audit performed (§3 below) |
| §4 Downstream implementation | `dashboard/index.html` | ✅ Built against the Spec Doc, including a live simulated 100 Hz → 5 s tumbling-window pipeline |
| §5 Grader | `grader/grader.js` (verbatim) + `grader/grader.v2.js` (hardened) | ✅ Original reproduced verbatim; defects fixed in v2 |

### Implementation highlights (proof the Spec Doc is executable)

- **Pipeline (Spec §1):** simulated 100 Hz feed aggregated into 5-second tumbling windows (mean/min/max); render queue decimated to ≤ 1,200 points; MTR-05 has a scripted gateway disconnect that renders as a grey hatched band (`#E2E8F0`) with an alert banner — **never** interpolated to zero.
- **Layout (Spec §2):** 3-column CSS Grid F-pattern (`kpi → nav/chart → table` areas), single-column stack under 768 px.
- **Color (Spec §3):** Okabe-Ito tokens with shape redundancy — `#0072B2` ● / `#E69F00` ▲ / `#CC79A7` 🛑 (drawn as a canvas octagon); `yMin: 0` explicit; 14 px body / 24 px KPI callouts.
- **Metric parity (Gate 4):** KPI cards and the chart read the *same* tumbling-window mean from the same `history` store.

---

## 3. Pre-Generation Audit (tutorial §4, step 2 — demonstrated)

Per `code_generation_prompt.md`, the audit performed *before* writing `dashboard/index.html`:

| Gate | Planned compliance logic |
| --- | --- |
| GATE 1 Baseline | Declare `chartConfig.yMin = 0` literally in the chart config and derive all y-mapping from it (`yAt(v)` subtracts `yMin`). Domain fixed `[0, 9]` — no auto-scaling path exists. |
| GATE 2 CVD | All three Okabe-Ito hexes as CSS custom properties *and* JS config; ● ▲ 🛑 tokens in the legend, the nav status column, and drawn on canvas. No red/green anywhere. |
| GATE 3 Budget | Static DOM is ~120 nodes; time-series rendered into a single `<canvas>`; log table paginated at 10 rows. Headless-safe: `getContext` null-guarded so jsdom does not crash the page logic. |
| GATE 4 Metric parity | KPI aggregation iterates the same `history[machineId]` arrays the chart draws; both consume the same 5 s window objects. |

---

## 4. Grader Test Matrix (evidence)

Fixtures in `.quarantine/` (gitignored probes): `adversarial-partial-palette.html` (only one Okabe-Ito color) and `adversarial-dom-bomb.html` (11 static nodes, injects 3,000 at runtime).

| Target | Original grader | grader.v2 | Assessment |
| --- | --- | --- | --- |
| `dashboard/index.html` (compliant) | **4 / 4** ✅ | **4 / 4** ✅ | Both correct |
| `adversarial-partial-palette.html` | **4 / 4** ❌ false positive | **2 / 4** ✅ correct | Original passes a dashboard with **no** amber, **no** magenta |
| `adversarial-dom-bomb.html` | **4 / 4** ❌ false positive | **1 / 4** ✅ correct | Original counts 11 *static* nodes; live DOM is 3,011 |

---

## 5. Findings (defects & improvements for the next version)

### F1 — BLOCKER: grader.js cannot run as published
`grader.js` does `require('jsdom')`, but the tutorial provides no dependency step. Fresh execution crashes with `MODULE_NOT_FOUND: 'jsdom'`.
**Fix for v2:** add `npm install jsdom` (and a `package.json`) to §5. Done in this repo (`npm run grade`).

### F2 — MAJOR: Gate 2 OR-logic defeats its own purpose
`hasOkabeIto = includes('#0072B2') || includes('#E69F00') || includes('#CC79A7')` — one color suffices for "CVD compliance" (proven: fixture scored 4/4). The gate should require **all three** status colors and **≥ 2** shape tokens. Also: the check is case-sensitive, so lowercase `#0072b2` (valid CSS) false-negatives.
**Fix for v2:** case-insensitive, require all three hexes + ≥ 2 distinct shape tokens.

### F3 — MAJOR: Gate 3 never sees the rendered DOM
`runScripts: "outside-only"` means page scripts never execute; the node count is the *static* HTML only. A page that injects thousands of nodes after load passes unchallenged (proven: fixture with 3,011 live nodes scored 4/4). This directly undermines the gate's stated threat model ("unaggregated SVG nodes freezing client rendering").
**Fix for v2:** `runScripts: "dangerously"` + `pretendToBeVisual`, wait ~500 ms for first render, count the **live** DOM. (Note: jsdom prints "Not implemented: getContext" unless the `canvas` package is installed — harmless if the dashboard null-guards `getContext`, as ours does.)

### F4 — MINOR: Gate 4 misses minified CSS
Substring `'display: grid'` fails on `display:grid` (no space). **Fix for v2:** normalize whitespace before matching; additionally require a `< 768 px` media query, since "responsive F-pattern" is part of Spec §4.

### F5 — MINOR: Gate 1 is a string heuristic, not a rendering check
Any occurrence of `yMin: 0` / `min: 0` (even in a comment, or on an unrelated axis) passes. Acceptable as a cheap lint, but the tutorial should state its limits: true baseline verification requires rendered-axis inspection (e.g., Playwright + pixel or DOM-tick assertions). **Fix for v2:** whitespace/case normalization; keep it a declared heuristic.

### F6 — DOC: zero-baseline doctrine is stated too universally
Enforcing `y_min = 0` is correct for this domain (vibration in mm/s is an absolute physical quantity, and truncation genuinely exaggerates drift). But Tufte's actual position is more nuanced: line charts of narrow-range data where the *level* matters can legitimately omit zero. **Fix for v2:** phrase the rule as "zero baseline for absolute quantities (counts, magnitudes); documented exceptions allowed for level-insensitive change detection."

### F7 — COSMETIC: rendering artifacts in the published page
MathJax source like `$y\_{\text{min}} = 0$` and escaped backticks appear literally in the exported tutorial HTML, which will confuse beginners copying from it.

### Verified-accurate claims
- Okabe-Ito hex values and CVD rationale: **accurate** (`#0072B2` blue, `#E69F00` orange, `#CC79A7` reddish purple per Okabe & Ito's Color Universal Design palette).
- F-shaped reading pattern attribution (Nielsen Norman Group): **accurate**.
- The Grill Me method attribution to Matt Pocock and its facts-vs-decisions / recommended-defaults framing: **accurate**.
- 100 Hz → 5 s tumbling windows + decimation as a browser-defense strategy: **sound and demonstrated** in `dashboard/index.html`.
- WCAG 2.2 AA 4.5:1 contrast: **accurate** (note: the dashboard uses darkened amber `#8A5A00` for warning *text* to actually meet 4.5:1 — `#E69F00` on white is ~2.2:1, a nuance v2 should call out for anyone using the palette for text vs. graphics).

---

## 6. Recommended v2 Tutorial Changes (priority order)

1. Add `npm install jsdom` + a `package.json` to §5 (F1).
2. Replace `grader.js` with the hardened logic in `grader/grader.v2.js` (F2–F4).
3. Add a short "What this grader cannot verify" note: rendered pixel output, actual contrast ratios, real WebSocket throughput (F5).
4. Soften the zero-baseline rule to a per-quantity decision with documented exceptions (F6).
5. Add a note on Okabe-Ito for **graphics vs. text** (4.5:1 text contrast needs darker variants) (verified-accurate list above).
6. Fix the MathJax/escaping artifacts in the exported HTML (F7).

## 7. Reproduce This Validation

```powershell
npm install          # installs jsdom
npm run grade        # tutorial grader (verbatim)      -> 4/4
npm run grade:v2     # hardened grader                 -> 4/4
```
