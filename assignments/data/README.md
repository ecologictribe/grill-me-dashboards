# Assignment 3 — Mystery Multi-Trap Dataset Packs

Generated deterministically by `scripts/generate-a3-datasets.js` (seed `20261113`).
**No trap hints are listed here by design** — inspecting the raw CSV and diagnosing what naive AI gets wrong is Phase 1 of Assignment 3.

| Pack | File | Rows | Columns |
| :--- | :--- | ---: | :--- |
| **Alpha** | `a3-pack-alpha.csv` | 48 | `date, node_id, forecast_kwh, band_low_kwh, band_high_kwh, actual_kwh, inverter_state, ambient_temp, temp_unit` |
| **Beta** | `a3-pack-beta.csv` | 48 | `record_id, student_name, phone_ext, medical_note, house, event_name, event_stage, reported_index, verified_score` |
| **Gamma** | `a3-pack-gamma.csv` | 1320 | `tx_id, date, zone_name, zone_area_sqm, zone_population, meal_slot, order_status, amount_inr` |
| **Delta** | `a3-pack-delta.csv` | 320 | `alert_id, timestamp, cohort, student_ref, severity, event_type, risk_prob, top_factor_1, factor_1_weight, top_factor_2, factor_2_weight` |

## Trainer Only: Generating Live Curveball Files (20 Nov 2026)

Run locally before Presentation Day (writes into gitignored `var/a3-curveballs/` so students cannot preview them on GitHub):

```powershell
node scripts/generate-a3-datasets.js --curveball 20261120
```
