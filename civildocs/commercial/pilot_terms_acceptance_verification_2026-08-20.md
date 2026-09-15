# Pilot Terms Acceptance Verification

**Date:** 20 August 2026  
**Environment:** CivilDocs development preview

The updated application opened on the pilot-access screen rather than the toolkit when no current browser-local Terms acceptance record existed. The **Test the app for free** action was initially disabled. The screen displayed an unchecked acceptance control for **CivilDocs Pilot Terms and Conditions, Version 1.1**, a direct Terms-reading action, and the disclosure that the acceptance version and time are recorded only in the current browser and do not constitute a paid-account record.

After selecting the checkbox, the action became available and the live status text stated that selecting the action would record the browser-local pilot acceptance before entering the workspace. The next check verifies the recorded version/timestamp and successful entry. No personal data was requested during this interaction.

The enabled action then opened the six-module toolkit. The preview’s browser storage contained an acceptance record with `termsVersion: "1.1"` and an ISO `acceptedAt` timestamp, while the pilot session value became `open`. This confirms that the entry guard records current-version acceptance before granting module access. The record remains deliberately browser-local and must not be treated as a paid-account audit record.

