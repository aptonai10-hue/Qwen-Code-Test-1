# CivilDocs Pilot Validation Evidence

## M5-01 — mandatory four-material escalation baseline

The live published application at `https://civildocs-zuztwkvm.manus.space` was opened on 20 August 2026. The following baseline was entered: a ZMW 1,595,900 project with a 5% trigger, 20% cap, and -10% floor; cement (850 at K185/K215), reinforcement steel (18 at K16,800/K18,900), diesel (12,500 at K28.50/K29.75), and aggregate (2,400 at K325/K385). The pilot gate requires the generated PDF to show a payable escalation of **K145,317.50**.

The live application completed generation and downloaded `Escalation_Clause_M5_01_Four_Material_Baseline_2026-08-20.pdf`. Its schedule listed all four materials with quantity, base rate, current rate, variance, and adjustment columns. The reconciliation section showed **K145,317.50** as the net payable escalation, exactly matching the pilot gate. M5-01 therefore **passed**.

The PDF extractor reported three pages while the visible document footer identified Page 1 of 2 and Page 2 of 2. This pagination discrepancy should be included in later PDF export-quality checks, although it did not affect the M5-01 figure or line-item visibility.

## Priority audit observations

The local regression suite already encodes the M5-01 expected total of K145,317.50, and the client escalation normalization calculates each line with threshold, cap, and floor controls. The Module 2 payment utility normalizes the certificate issue date from the current browser-local calendar date before PDF rendering. Its live PDF outcome still needs to be observed.

## M2-01 and M2-12 — normal IPC and current-year date check

The live published application received a normal IPC scenario with an original contract sum of K850,000, previously certified value of K210,000, current-period gross valuation of K125,500, zero deductions, and a 14-day payment term. This should produce a cumulative valuation of **K335,500** without an over-certification warning.

The live review flow presented four valuation lines for confirmation. The four lines reconciled to K210,000 previously certified and K125,500 current-period value: K50,000/K15,000, K100,000/K60,000, K40,000/K30,500, and K20,000/K20,000. These line values are consistent with the expected cumulative valuation of **K335,500**.

The completed and downloaded PDF was titled `Payment_Certificate_Kitwe_Drainage_Rehabilitation_IPC_Date_Check_2026-08-20.pdf`. It showed a date issued of **2026-08-20**, payment due of **2026-09-03 (14 days)**, and a cumulative valuation of **K335,500.00**. Its four-line schedule, summary, and net proposed certification amount were consistent. M2-01 and M2-12 therefore **passed**.

As with M5-01, the PDF extractor reported three pages while the document footer identified two pages; this is recorded as a quality-check observation rather than a calculation failure.

## Automated regression status

The complete local regression suite passed: **29 test files and 126 tests**. The passing suite includes the escalation baseline, payment-date normalization, financial-precision, warning, formatting, variation, portfolio, inspection, and PDF-data preparation utilities. The TypeScript check also completed without errors. Expected timeout errors from the Gemini proxy timeout test appeared in its controlled test output, while that test still passed.

## M1-01 — Chimwemwe emergency drainage spot check

The live bid-package builder was populated with the Chimwemwe, Kitwe scenario: 300 metres of reinforced-concrete U-drain, two pipe culverts, excavation, bedding, backfill, compaction, traffic management, a 14-day mobilisation, and a ZMW 1,250,000 budget. The initial request safely timed out, while the one retry completed and produced `Bid_Package_Chimwemwe_Emergency_Drainage_Works_2026-08-20.pdf`.

The first PDF correctly used ZMW and included a BOQ, technical-proposal material, mobilisation scope, traffic management, the stated submission date, and the core drainage / culvert work. However, it contained explicit completion placeholders such as **“[none / bidder to state]”** and repeated **“Bidder completion required”** prompts. It also lacked a distinct cover letter and drawings list. Under the supplied pass rule, the first M1-01 attempt **failed**.

Following the repair and deployment refresh, the live domain produced `Bid_Package_Chimwemwe_Emergency_Drainage_Works_2026-08-20 (2).pdf`. It contains a distinct **Tender Cover Letter** with the supplied tender facts, a **Drawings and Technical Reference Checklist** that avoids inventing drawing numbers, a ZMW BOQ, stated submission date, and no user-visible bracketed placeholders or “bidder completion required” text. The repaired **M1-01 passed**.

The published domain initially served the previous Vite asset hash after the first checkpoint. A follow-up deployment refreshed the asset to the verified build containing the repaired content, after which the live PDF validation succeeded.

## M3-15 — culvert replacement variation and EOT spot check

The live Module 3 workflow generated and downloaded `Variation_EOT_Chimwemwe_Emergency_Drainage_Works_2026-08-20.pdf` for a K236,480 culvert-replacement variation and a seven-day EOT. Its claim-item table, revised contract value, supporting justification, and requested action consistently showed **K236,480.00** and **7 days**. The status was correctly marked Proposed, rather than represented as approved. M3-15 therefore **passed**.

The PDF extractor again reported three pages while its footer identified two pages; this recurring pagination-report discrepancy remains a non-blocking export-quality observation.

## M4-01 — two-project NCC portfolio spot check

The live Module 4 workflow generated and downloaded `NCC_Grade_Portfolio_CivilDocs_Test_Contractor_2026-08-20.pdf` with project values of K125,000,000.55 and K88,900,000.00. The project table and portfolio-value line both showed **K213,900,000.55** exactly. The target NCC grade, civil-engineering category, completion references, evidence status, and ZMW formatting were consistent. M4-01 therefore **passed**.

The PDF extractor again counted three pages while the footer identified two; this does not affect the visible portfolio total or project list.

## M6-02 — major concrete-defect log spot check

The live Module 6 PDF, `Site_Inspection_Chimwemwe_Emergency_Drainage_Works_2026-08-20.pdf`, correctly recorded the exact CH 0+450 location, inspection date, high severity, evidence reference `IMG-CH0450-01`, non-compliant status, and target close-out date of 2026-06-18. However, its responsibility field was **“To be assigned”** rather than the requested contractor responsibility, and the required corrective action was not rendered as a dedicated defect-register field. Under the supplied requirement that each defect have a location, severity, responsibility, action, due date, and photo reference, **M6-02 failed** and requires a targeted repair.

After the repair, the live application produced `Site_Inspection_Chimwemwe_Emergency_Drainage_Works_2026-08-20 (1).pdf`. The main defect register shows CH 0+450, High severity, **Contractor** responsibility, the 2026-06-17 close-out date, and `IMG-CH0450-01`. Its new **Corrective Action Register** separately and visibly records the responsible party, engineer-approved honeycombing repair action, due date, and evidence reference. The repaired **M6-02 passed**.

