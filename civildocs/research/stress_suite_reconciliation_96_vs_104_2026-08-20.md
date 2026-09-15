# CivilDocs Stress-Suite Reconciliation: 96 vs 104

**Date:** 20 August 2026  
**Source suite:** `civildocs_final_stress_test_suite_2026-08-19.md`  
**Execution matrix:** `final_stress_execution_matrix_2026-08-19.md`

## Reconciliation result

The user-supplied suite contains **96 module cases**: 15 for CD-01, 18 for CD-02, 15 for CD-03, 15 for CD-04, 17 for CD-05, and 16 for CD-06. The existing matrix contains **104 cases** because it adds the eight shared safety-valve cases **S.1–S.8**. There is no duplicated module-case family; the difference is the shared safety layer.

| Component | Cases | Explanation |
|---|---:|---|
| CD-01 Bid Package Builder | 15 | User suite and matrix use the same IDs 1.1–1.15. |
| CD-02 Interim Payment Certificate | 18 | Same IDs 2.1–2.18. |
| CD-03 Variation & EOT Claims | 15 | Same IDs 3.1–3.15. |
| CD-04 NCC Grade Upgrade Portfolio | 15 | Same IDs 4.1–4.15. |
| CD-05 Escalation Clause Builder | 17 | Same IDs 5.1–5.17. |
| CD-06 Site Inspection & Defect Log | 16 | Same IDs 6.1–6.16. |
| Shared safety valves | 8 | Matrix-only additions S.1–S.8. |
| **Total** | **104** | **96 module cases + 8 shared safety cases**. |

## Pending and priority cases

The matrix currently records 19 cases as `PENDING — credit hold`. These are the efficient priority batch after billing confirmation because each one has a focused observable not already covered by existing published evidence or deterministic tests.

| Priority | Case | Gap to close | Required evidence |
|---:|---|---|---|
| 1 | 1.11 | CD-01 identical-input repeat stability | Two public runs compared for BOQ count, totals, dates, and PDF values. The local exact-input cache fix is regression-tested but the second published run still needs capture. |
| 2 | 2.11 | Near-contract-boundary line-item quality | Review and PDF must show sensible, varied valuation lines near the limit. |
| 3 | 2.12 | Normal-range line-item quality baseline | Capture a baseline alongside 2.11 for comparison. |
| 4 | 2.13 | Certificate sequencing behavior | Determine whether Cert 2 carries Cert 1 cumulative value or clearly requires manual entry. |
| 5 | 2.10 | Identical-input date stability | Compare two public certificates generated on the same day. |
| 6 | 3.12 | Identical-input Variation/EOT stability | Compare two combined-claim runs and PDFs. |
| 7 | 3.11 | Blank versus explicit contractual basis | Compare both prompt paths and confirm the clause source is not fabricated. |
| 8 | 1.8 | Ambiguous project type | Confirm a reasonable generic BOQ and PDF rather than nonsense or failure. |
| 9 | 1.9 | Case-specific currency layout | Confirm every printed value in the selected public PDF has two decimals and reconciles. |
| 10 | 1.10 | Case-specific ZPPA structure | Confirm headings, numbering, BOQ columns, and technical-proposal sections in the selected PDF. |
| 11 | 1.12 | Deliberate CD-01 public failure | Preserve form data and show clear retry state. |
| 12 | 1.14 | CD-01-specific refresh preservation | Refresh a populated bid form and compare sentinels. |
| 13 | 2.15 | Deliberate CD-02 public failure | Preserve certificate fields and show clear retry state. |
| 14 | 3.14 | Deliberate CD-03 public failure | Preserve claim fields and show clear retry state. |
| 15 | 4.14 | Deliberate CD-04 public failure | Preserve portfolio fields and show clear retry state. |
| 16 | 5.16 | Deliberate CD-05 public failure | Preserve the full materials schedule and show clear retry state. |
| 17 | 6.15 | Deliberate CD-06 public failure | Preserve inspection observations and show clear retry state. |
| 18 | S.6 | Under-one-second loading behavior | Controlled/public near-instant response should show no jarring skeleton flash. |
| 19 | 1.4 | Small-project proportionality | Capture the final public small-project BOQ and confirm no generic bloat. |

## Coverage already confirmed and therefore excluded from rerun

The existing evidence and deterministic suite already cover the main arithmetic and safety boundaries: CD-02 over-certification at K530,000.00 against K500,000.00, exact-boundary cumulative K500,000.00, negative correction K-15,000.00, nine-figure cent precision, CD-03 variation/EOT reconciliation and date shifts, CD-04 high-value portfolio totaling K83,000,000.80, CD-05 four-material reconciliation totaling K145,317.50, cap/floor disclosure, explicit rate overrides, and CD-06 15–25 item multi-page inspection flows. These should not be regenerated merely to increase the request count.

## Execution order after Tier 1 confirmation

Run the first batch as 1.11, 2.11, 2.12, 2.13, 2.10, 3.12, and 3.11 because these are the highest-risk determinism and semantic-quality checks. Run the second batch as 1.8, 1.9, 1.10, 1.4, and S.6. Run the third batch as the six deliberate-failure cases 1.12, 2.15, 3.14, 4.14, 5.16, and 6.15. Stop and record a `BLOCKED` status if the upstream provider or the public domain prevents a valid review/PDF observation; do not substitute a proxy-only HTTP 200 for a required document pass.

## Reconciliation conclusion

The 104-case matrix is the correct superset for this project. The 96-case suite is not missing a module; it omits the eight shared safety controls. The efficient post-billing campaign is therefore the 19-case pending list above, not a full rerun of all 104 cases.

