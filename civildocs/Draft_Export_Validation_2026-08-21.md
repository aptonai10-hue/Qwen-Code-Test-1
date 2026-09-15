# CivilDocs Saved-Draft Export Validation

**Date:** 21 August 2026  
**Scope:** Browser-local saved-draft export for PDF and Word-compatible `.doc` files.

## Interactive Validation

In an isolated pilot preview session, the CD-01 Bid Package Builder form was populated with a project name, employer, location, tenderer, currency, and description. The application saved the draft locally and exposed the inline **Download draft PDF** and **Download draft Word** controls without initiating an AI generation.

Both controls were activated for the same populated draft. The export flow remained in the browser, preserved the entered values, and did not submit the draft to the AI endpoint. The generated file names use the module code, project name, `Draft` marker, and export date.

| Check | Result |
|---|---|
| Current-form PDF button visible | Pass |
| Current-form Word button visible | Pass |
| Populated draft remains in form after both downloads | Pass |
| Export does not require AI generation | Pass |
| Device-local data notice is visible | Pass |
| 375×812 export-control layout review | Pass |

## Dynamic-Row Validation

The CD-05 Escalation Clause Builder was opened with a browser-local saved draft and its material row was completed with **Cement**, quantity **850**, unit **50 kg bag**, base rate **185**, current rate **215**, and supplier source **Supplier invoice August 2026**. Both current-form export controls were activated without initiating an AI generation. The downloaded file content is checked separately as part of this validation record.

The downloaded `.doc` contained Cement, 850, 50 kg bag, and Supplier invoice August 2026. Text extraction from the matching PDF confirmed the same material row, including its base and current rate. The 375×812 release-build review confirmed that the pilot entry, local-draft messaging, and responsive export-button layout have sufficient phone spacing; the populated current-form controls were separately activated in the browser validation.

The empty register state is now covered through the rendered export-register markup helper, which produces the explicit no-drafts message when no browser-local record exists. For additional phone interaction evidence, the populated form panel was constrained to a **355px content width** (the working width inside a 375px phone viewport). The export action container measured 313px wide with no horizontal overflow, and both **Download draft PDF** and **Download draft Word** controls were activated successfully. This is a controlled browser-width simulation, supplemented by the separate 375×812 release-build visual review; it is not a substitute for testing on a physical handset.

| Dynamic check | Result |
|---|---|
| Word export includes saved material fields | Pass |
| PDF export includes saved material fields | Pass |
| Current-form PDF and Word controls remain usable after dynamic-row entry | Pass |
| Rendered empty saved-draft register message | Pass |
| Constrained 355px-content-width PDF export interaction | Pass |
| Constrained 355px-content-width Word export interaction | Pass |

## Automated Validation

The dedicated draft-export utility tests cover a readable export model, dynamic material-row inclusion, HTML escaping for Word-compatible documents, and safe fallback file names. The complete regression, type, and production build checks are recorded with the release checkpoint.

The final reconciled validation passed **47 test files and 177 tests**, TypeScript checking, and the production build. It also preserved the concurrent browser-local feedback-manager release alongside the new export controls.

## Published Release Check

The published release checkpoint `d138bec6` loaded the controlled pilot entry and opened the CD-01 workspace after local Terms acceptance. A previously saved browser-local CD-01 draft was restored without requesting AI generation. The current-form export controls are verified in the following release interaction step.

After deployment propagation, the public page served `assets/index-BTebiTfG.js`. The published bundle contains the Word-compatible document MIME type, jsPDF export path, and saved-draft register markup, while the public entry exposes the **Export saved drafts** section. This confirms that the final hosted bundle includes the local export implementation.

