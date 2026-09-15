# Pricing, Fair-Use and Pilot Feedback Verification

**Date:** 20 August 2026  
**Environment:** CivilDocs development preview

The footer **Pricing & Fair Use** control opened the dedicated pricing view. The browser rendered all three plans: Founding Engineer at ZMW 199/month for the first three paid months, Professional at ZMW 299/user/month, and Firm at ZMW 1,199/month for up to five named users. The page also displayed the 30/30/150 proposed allowance terms, a device-local Founding Engineer usage meter at zero of thirty, and the explicit statement that the tracker is not account-level billing or cross-device enforcement.

The pilot-feedback form was visible with optional name, plan selection, required question text and a prepare-message control. A non-sensitive sample question was entered for the next verification step. The design states that the form does not send content automatically; it prepares text for copying and only offers an email-draft route when a public support address is configured.

The prepared-message interaction completed without transmitting the sample message. With no public support email configured, the interface stated that the message was ready to copy and that nothing had been sent automatically. A visual defect that exposed the otherwise hidden email-draft action was corrected and regression-tested.

For the warning-state check, a temporary preview-only local usage record of 24 completed generations was applied. The pricing view rendered **“Fair-use reminder: 6 of 30 device-local generations remain this month”** and the visible approach-cap warning. The configured email-draft control remained hidden while no support address was set. The temporary local usage record must be cleared after verification.

