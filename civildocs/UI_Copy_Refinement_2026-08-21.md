# CivilDocs Pilot Copy and Presentation Refinement

## Audit Finding

The current pilot entry communicates the product purpose well, but repeats implementation detail across the entry screen, workspace, profile, feedback, settings, and footer. The most distracting patterns are internal labels such as field-ledger identifiers, recurring explanations about unavailable future features, duplicated local-storage wording, and verbose pilot-plan context. These statements dilute the central task: choosing and preparing a contractor document.

## Refinement Principles

The revised interface will retain the disclosures a tester needs: affirmative Terms acceptance, local-only storage, disabled pilot purchasing, and the professional-review warning. It will remove or shorten surrounding implementation detail, consolidate repeated device-local messages, and use task-focused wording. The document register remains the primary action.

## Visual Direction

The supporting visual is a low-contrast engineering field sketch with drainage, bridge, survey, and contour motifs. It is intentionally text-free, subdued, and placed as a supporting visual rather than a marketing hero. The product continues to use its navy, paper, and amber engineering-document palette.

## Responsive Review

The desktop review confirms that the document register remains the primary object, while the rate schedule now reads as an administrative continuation rather than a marketing card group. The image is confined to a small technical substrate inside the review panel. The 375×812 review confirms that the register, Terms notice, visual panel, rate schedule, and footer stack cleanly without clipped controls. The watermark crowds the small brand tagline on narrow phones, so the compact header requires one final responsive adjustment before release.

The final 375×812 header review removes the narrow-screen tagline and retains a clear CivilDocs mark and separate Pilot Test watermark. The register heading, all six rows, Terms control, and status note remain readable without overlap.

The current-build interaction review confirmed the streamlined entry labels, Terms checkbox, concise accepted-state announcement, and all six document routes. Terms acceptance remains affirmative, keyboard-reachable, and stored locally as intended.

The CD-01 workspace opens with the compact feedback note, saved-draft PDF and Word controls, and the concise local-draft indicator intact. Settings opens from the workspace with a labelled modal, a focused close control, the appearance action, and the saved-feedback manager. No generation request was made during this review.

The final accessibility check confirms that the Settings dialog exposes `role="dialog"`, `aria-modal="true"`, `aria-labelledby="settings-title"`, and `aria-describedby="settings-note"`. The close control receives initial focus, and the next keyboard Tab action reaches the appearance control. The Terms and workspace actions retain their visible labels and live-status support.

The visible close control returns to the entry screen as expected. The Escape key did not close the Settings dialog, so keyboard dismissal is being added before release.

After adding keyboard dismissal support, a fresh entry review again confirmed that the concise Terms gate announces acceptance and permits document access without exposing internal implementation wording.

The refined CD-01 workspace restored its browser-local draft and successfully activated **Download draft PDF** without making an AI request. The Word-compatible export is checked in the next interaction.

The same restored draft successfully activated **Download draft Word**. The refined `pilot-access-status`, `entry-feedback-status`, and `draft-export-status` elements each retain `role="status"` with `aria-live="polite"`.

The refined PDF and Word downloads were confirmed in the browser download directory as `Bid_Package_Chimwemwe_Clinic_Extension_Draft_2026-08-21.pdf` and `.doc`. The Settings dialog now closes with Escape and returns focus to the Settings trigger, completing the keyboard-dismissal check.

The saved-feedback manager opens from Settings with a labelled modal and a clear browser-local empty state. Its Escape behavior is verified in the next interaction.

Escape closes the saved-feedback manager and returns focus to **View feedback**. Both refined dialogs now support a visible close action, Escape dismissal, and focus return to the originating control.

The keyboard-only pass begins at the entry register: Tab visibly reaches the M1 document row with the existing focus treatment.

Subsequent Tab navigation continues through the document-register rows without losing the visible focus state. The Terms-control interaction is verified next.

The labelled Terms checkbox receives focus and toggles with Space, updating the concise accepted-state announcement.

With Terms accepted, the M1 document row receives focus and opens the CD-01 workspace with Enter. The focused workspace controls are checked next.

The active workspace exposes both PDF and Word saved-draft export actions for keyboard activation.

The visible Word export control receives focus and activates with Enter, completing the keyboard export check without invoking AI generation.

The workspace back control receives focus and returns to the document register with Enter, preserving the saved-draft export status message.

From the document register, the Settings trigger receives focus and opens with Enter. The keyboard-only pass therefore covers the entry register, Terms acceptance, document opening, saved-draft export, back navigation, and Settings access.

The final automated control audit confirms that the Terms checkbox, document route, back navigation, Settings trigger, and PDF/Word export actions remain native keyboard-focusable controls, with Escape dismissal wired for both modal panels. Final validation passed **48 test files and 180 tests**, TypeScript checking, and a production build.

## Publication verification

Checkpoint `ae939b2a` was saved for the refined release. The first two public-domain reads continued to return the preceding bundle, so the public verification remained pending normal deployment propagation rather than being recorded prematurely.

After propagation, the published domain served the refined bundle. The live entry screen showed **“Zambia · contractor documents,” “Document register,” “Choose a document,”** the concise device-local wording, the technical visual panel, and the **“Rate schedule”** presentation. The public release also retained all six document-route buttons, the Terms checkbox, and the Settings, pricing, and Terms controls.

The published desktop render showed the low-contrast engineering sketch confined to the top of the working-documents panel. Opening live Settings displayed its labelled modal, and Escape closed it successfully, returning the interface to the normal entry screen.

The published saved-feedback manager also opened from Settings with its visible **Saved route feedback** title, close control, and browser-local empty state. Its Escape/focus-return verification follows.

Escape closed the published saved-feedback dialog while leaving Settings open, and focus returned to the **View feedback** trigger (`feedback-manager-open-button`). The live visual and both refined modal keyboard behaviors are therefore verified on the published bundle.

The final Cloudflare-ready handoff is **`CivilDocs_Cloudflare_Shipping_2026-08-21.zip`**. It was refreshed against the final public-verification record, checkpoint `113f943a`, and its ZIP integrity check completed successfully.

