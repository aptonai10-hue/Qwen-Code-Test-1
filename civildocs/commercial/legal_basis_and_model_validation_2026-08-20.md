# CivilDocs Commercial Terms — Legal Basis and Model Validation

**Status:** Working legal research note and financial-model validation record  
**Date:** 20 August 2026

## Official Legal Context

The CivilDocs terms draft is deliberately framed as a working draft rather than a substitute for Zambian legal advice. It incorporates the following limited, verified legal context.

| Source | Verified scope | Direct product implication |
|---|---|---|
| [National Assembly of Zambia — Data Protection Act, 2021](https://www.parliament.gov.zm/node/8853) | The Act describes regulation of the collection, use, transmission, storage and other processing of personal data; the rights of data subjects; and duties of data controllers and processors. | A public privacy notice, retention approach, controller contact, processor assessment and pre-launch confirmation of applicable registration/licensing obligations are required before paid launch. |
| [National Assembly of Zambia — Electronic Communications and Transactions Act, 2021](https://www.parliament.gov.zm/node/8842) | The Act describes a safe and effective environment for electronic transactions, secure electronic signatures, electronic filing, and legal certainty in electronic communications and transactions. | Paid activation should use an explicit acceptance record, transparent order/invoice terms and clear electronic notice contact details. |
| [ZambiaLII — Competition and Consumer Protection (Amendment) Act, 2023](https://zambialii.org/akn/zm/act/2023/21/eng@2023-12-26) | Act 21 of 2023 amends the Competition and Consumer Protection Act, 2010. | Public pricing, billing frequency, cancellation, renewal, restrictions and AI-usage limits must be stated plainly; legal counsel should confirm the final paid-flow wording. |

> **Legal limitation:** The current in-app Terms screen is an important disclosure control. It does not guarantee that CivilDocs will avoid claims, does not replace a privacy notice, and must be reviewed by a qualified Zambian lawyer before paid activation.

## Workbook Validation

The generated workbook `CivilDocs_90_Day_Revenue_Projection_2026-08-20.xlsx` contains three worksheets: **Assumptions**, **Revenue Model**, and **Checks**. It was recalculated in a spreadsheet engine after generation, and its revenue rows are formula-driven from blue, commented assumption inputs.

| Formula-derived base-case output | Result |
|---|---:|
| Month 1 gross subscription billings | ZMW 796.00 |
| Month 2 gross subscription billings | ZMW 1,593.00 |
| Month 3 gross subscription billings | ZMW 3,888.00 |
| 90-day gross subscription billings | ZMW 6,277.00 |
| Month 3 paid-seat equivalent | 16.00 |
| 90-day included AI generation capacity | 810.00 |

The model excludes VAT, payment-processing charges, Gemini/model costs, hosting, payroll, support, refunds, bad debt and income taxes. It should therefore be labelled **gross subscription billings**, not revenue net of refunds or profit.

## In-App Terms Interface Verification

The development preview was opened on 20 August 2026. The footer’s **Terms and Conditions** control opened a dedicated, keyboard-reachable Terms view. The rendered page showed the pilot-only status, the mandatory professional-review warning, proposed 30/30/150 monthly AI-generation allowances, acceptable-use restrictions, Data Protection Act and Electronic Communications and Transactions Act links, and a visible return-to-toolkit control. The page uses the production Vanilla JS navigation pattern and responsive overflow handling for its pricing table.

