# DATA VISUALIZATION SPECIFICATION DOCUMENT (SPEC DOC)
Project ID: DASH-SPEC-2026-081
Target Engine: Standalone HTML5 Canvas / D3.js or Power BI Desktop (PBIP/TMDL)

---

## 1. SYSTEM ARCHITECTURE & DATA PIPELINE
- **Data Source & Ingestion:** Streaming IoT WebSocket endpoint (100 Hz raw feed).
- **Pre-Render Aggregation:** 5-second tumbling window computing Mean, Min, Max values.
- **High-Frequency Defense:** Canvas path decimation capping active render queue at 1,200 points.
- **Missing Telemetry Policy:** Explicit null banding using shaded grey hatch pattern (`#E2E8F0`) and alert banner.

---

## 2. VISUAL LAYOUT & HIERARCHY (F-PATTERN GRID)
- **Top Stem (F-Top):** Core KPI Cards (Active Units, Vibration Index, Alarm Count).
- **Mid Stem (F-Mid):** Real-time multi-axis vibration line chart with warning thresholds.
- **Left Stem (F-Left):** Machine hierarchy selector tree and fleet status filters.
- **Bottom Zone:** Paginated historical anomaly log table sorted by severity.

---

## 3. COLOR, ACCESSIBILITY & STYLING RULES
- **Palette Selection:** Okabe-Ito colorblind-safe design tokens.
  - **Normal Status:** `#0072B2` (Sky Blue) with Circle Icon (●).
  - **Warning Status:** `#E69F00` (Amber Orange) with Triangle Icon (▲).
  - **Critical Status:** `#CC79A7` (Reddish Purple) with Octagon Icon (🛑).
- **Baseline Integrity:** Enforce absolute zero baseline (`yMin = 0`) across all trend graphs.
- **Typography Standards:** Sans-serif font stack (Inter, Roboto) with minimum 14px body and 24px KPI callouts.
- **Contrast Ratios:** Minimum 4.5:1 text-to-background contrast ratio (WCAG AA compliant).

---

## 4. INTERACTIVITY & RESPONSIVE BREAKPOINTS
- **Desktop Layout (>= 1024px):** 3-column CSS Grid enforcing the F-Pattern.
- **Mobile Layout (< 768px):** Single-column vertical stack (KPI Cards -> Telemetry Chart -> Log Table).
- **Tooltip Interaction:** Hover inspection displaying exact timestamp (UTC), mean vibration, and peak spike amplitude.

---

## 5. EVALUATION FRAMEWORK & ANTI-DRIFT VERIFICATION GATES
[ ] GATE 1: Baseline Integrity ($y_{\text{min}} = 0$)
[ ] GATE 2: Color Accessibility (Okabe-Ito + Dual Shape Tokens)
[ ] GATE 3: Performance Budget (DOM Elements <= 1,500)
[ ] GATE 4: Metric Consistency (KPI logic matches Chart Aggregation)
