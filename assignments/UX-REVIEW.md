# UX Review — `assignments/index.html`

**Reviewer:** OpenCode agent (UI/UX audit) · **Date:** 29 Oct 2026
**Scope:** the class assignment page only (`assignments/index.html`), evaluated
against its actual job: get ~50 students from "which 3 challenges?" to "PDF
submitted + self-score captured" in one week, mostly on phones, many at the
last minute.

---

## What already works (keep these)

| Strength | Why it works |
| --- | --- |
| Deadline badge in the header + amber timeline table | The two dates (issued 29 Oct / due 5 Nov) are unmissable. |
| Per-card 🤺 method + 📦 dataset chips | Zero-hop access to the two things a stuck student needs first. |
| Interactive scorecard with auto totals + verdict banner | Turning the rubric into the submission artifact is the page's strongest move — the form *is* the pedagogy. |
| Honesty component (C1) computed live | Makes the self/trainer gap tangible instead of abstract. |
| localStorage persistence | Students can fill the scorecard across sessions. |
| Self-evaluation screenshot steps + checklists | Concrete capture recipe (Win+Shift+S, what must be visible, trainer column blank). |
| Difficulty filter on challenges | Fast way to find the recommended 1+1+1 spread. |

---

## Findings & recommendations

Priorities: **P1** = do before the class sees the page · **P2** = high value,
moderate effort · **P3** = polish.

### P1 — Blocking or high-risk

| # | Finding | Recommendation |
| --- | --- | --- |
| 1 | **Printing breaks the page.** Sections use `.reveal` (`opacity:0` until an IntersectionObserver fires). `Ctrl+P` on any page region the student hasn't scrolled past prints **blank**, and the self-eval section explicitly tells students they may print the scorecard. | Add a `@media print` block: `.reveal{opacity:1 !important; transform:none !important}`, hide nav/progress-bar, white background. ~10 lines. |
| 2 | **No aria-labels on the 22 score inputs.** Screen readers announce "spinbutton, 0 of 3" with no idea which component. The rubric has row IDs (A1…D4) already. | `aria-label="A1 self score (max 3)"` per input — can be generated in JS from the row's first cell + `data-max` + class, one loop, no HTML churn. |
| 3 | **No "print just my scorecard" path.** Students are told to screenshot, but the table is 5 columns × ~18 rows — on a phone the screenshot is cramped or split. | Add a small "🖨 Print scorecard only" button: `@media print` showing only `#scorecard`, everything else `display:none`. Gives a clean PDF page as an alternative to the screenshot. |
| 4 | **Silent score restore.** localStorage re-fills the Self column with no indication — a student borrowing a lab PC may screenshot someone else's claim, or think the form is broken when their entries vanish on another machine. | Show a "✓ Scores restored from this browser (date)" chip when `saved` is non-empty, plus a **Reset scores** button (confirm() then clear key + reload). The self-eval steps should also say "the screenshot must show *your* numbers". |

### P2 — Flow & comprehension

| # | Finding | Recommendation |
| --- | --- | --- |
| 5 | **No table of contents / sticky section nav.** The page is ~480 lines with 10 sections. Students hunting "where do I declare?" scroll past the whole challenge list every time. | Sticky chip-bar under the top nav (Overview · Timeline · Challenges · Declare · Score · Self-Eval · Present) with smooth-scroll + scroll-spy highlight. ~30 lines JS/CSS. |
| 6 | **No live countdown.** Static "Due 5 Nov 2026" doesn't create urgency and hides "it's tomorrow". | Header chip: `⏳ X days left` computed against `2026-11-05T23:59+05:30`; flip to red inside 48h, "LAST DAY" on 5 Nov. |
| 7 | **Scorecard hides section subtotals.** Students can't tell whether they've filled all of A (30) before moving to B; the total alone doesn't localize gaps. | Add live subtotal cells to the section header rows (`A · 24/30`) — the recalc function already sums by class; extend to per-section. |
| 8 | **Declaration friction: one template for three reports.** The copy block says `[1 / 2 / 3]` — students must manually re-fill it 3× and it's easy to file only one. | Three collapsed `<details>` blocks (Report 1/2/3) with pre-numbered templates + per-block copy buttons; or a report switcher that swaps the template number. |
| 9 | **Trio spread isn't trackable.** The recommended 1 easy + 1 medium + 1 hard exists only as prose; nothing marks which 3 a student picked. | Add a "My trio" tracker: a checkbox on each challenge card (persisted); a sticky mini-summary shows picked count + difficulty mix and warns on 2 easies. Moderate effort, big anti-confusion win for a class of 50. |
| 10 | **Mobile touch targets.** Score inputs are 64×~26px — under the 44px touch guideline; the 5-column table scrolls horizontally with no affordance hint. | Bump input padding/height on small screens; add a fading right-edge shadow or "swipe →" hint on `.op-table` wrappers. |

### P3 — Polish

| # | Finding | Recommendation |
| --- | --- | --- |
| 11 | Clipboard copy uses `navigator.clipboard` only — fails silently on `file://` or non-HTTPS (students opening the cloned repo locally). | Fallback: temporary `<textarea>` + `document.execCommand('copy')`, and a "select & copy manually" state on failure. |
| 12 | Dataset chips on mobile open a raw CSV blob in a new tab — feels like a broken page. | Keep links, but the self-eval step list should note "on phone, long-press a Dataset chip → Download link". |
| 13 | The verdict banner is the page's emotional peak but sits below a 5-column table — easy to miss after filling. | After the first non-zero recalc, smooth-scroll the verdict into view once (or mirror the verdict color into a sticky bottom bar while the scorecard section is on screen). |
| 14 | No empty-state guidance on the trainer column ("why are these boxes editable?"). | Column header tooltip: "Trainer fills this column during the viva — leave it blank." |
| 15 | Timeline says "Trainer doubts sessions as scheduled in class" — vague anchor. | Link to a shared calendar/eflow announcement, or state the slot. |

### Deliberate non-goals (do NOT do)

- **Don't** move the scorecard to a separate page — the rubric *being* the
  submission artifact is the pedagogy.
- **Don't** auto-save to a server — the honesty component depends on the
  screenshot being the student's own claim.
- **Don't** add the countdown's exact hours — day granularity matches how the
  week actually runs.

---

## Suggested implementation order

1. Print stylesheet + print-scorecard button (#1, #3) — one CSS block + one button.
2. aria-labels + restored/reset affordance (#2, #4) — small JS.
3. Countdown chip (#6) and sticky TOC (#5).
4. Section subtotals (#7), declaration tabs (#8), trio tracker (#9).
5. Polish (#10–#15) as time allows.

*Update this file when recommendations are applied; stamp both with the
page's `last-updated` meta value.*
