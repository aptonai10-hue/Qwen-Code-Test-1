# CivilDocs Pilot UX Validation Record

**Date:** 20 August 2026  
**Environment:** CivilDocs development preview, browser-local storage, and production build validation.  
**Purpose:** Validate the new external-pilot access, profile, draft recovery, and failure-recovery UX before publication.

| Run | Scenario | Expected behavior | Observed result | Status |
|---:|---|---|---|---|
| 1 | Fresh browser entry | A clear pilot gateway appears before the document register. | The opening screen displayed the external-pilot explanation and the **Test the app for free** action. | Pass |
| 2 | Unavailable account options | Sign in, Sign up, and Google access are visibly unavailable and cannot be activated. | All three controls were faded, disabled, and labelled **Not available**. | Pass |
| 3 | Free pilot entry | The free-test action opens the CivilDocs workspace. | The action opened the module register without collecting account or payment data. | Pass |
| 4 | Pilot pricing state | Pricing is visible for preview but cannot be selected or purchased. | Every pricing CTA is disabled and labelled **Not available during pilot**. | Pass |
| 5 | Pilot profile save | Company, contact, phone, email, and location can be saved locally. | The profile panel saved the test values and updated the workspace summary to `CivilDocs Test Contractor · Jane Engineer`. | Pass |
| 6 | Compatible field prefill | A saved profile prepopulates matching fields without overwriting a draft. | The inspection form received Kitwe, Jane Engineer, and CivilDocs Test Contractor in compatible blank fields. | Pass |
| 7 | Per-keystroke draft persistence | A text edit is written to the browser-local draft immediately. | Browser-local storage contained the exact newly entered observation text immediately after entry. | Pass |
| 8 | Draft restoration | An incomplete form is restored after reopening the module. | The inspected draft reopened with project, observation, date, weather, and profile-prefilled fields retained. | Pass |
| 9 | Busy-server recovery | Failure explains reason, what happened, why, and next action; it keeps the draft and offers retry. | The controlled busy-server run showed all four explanations, **Try again now**, a four-minute countdown, and unchanged inputs. | Pass |
| 10 | Responsive and automated validation | The entry screen remains usable on mobile and source passes verification. | The 375×812 mobile review showed no clipped controls; `pnpm build` passed; `pnpm test` passed 34 files / 141 tests. | Pass |

## Notes

The automatic retry is deliberately bounded to one retry per in-session failure. It runs only for temporary-capacity or timeout conditions, displays a visible four-minute countdown, and can be cancelled with **Keep editing**. Input changes cancel the scheduled retry, so the app never resubmits a materially edited form without the tester’s new decision.

All profiles and drafts used in these checks stay in the browser-local storage of the test device. They are not sent by the profile UI itself, and any form field can still be manually changed before generation.

