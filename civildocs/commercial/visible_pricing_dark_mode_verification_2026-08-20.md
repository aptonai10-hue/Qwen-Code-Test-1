# Visible Pricing and Appearance Verification

**Date:** 20 August 2026  
**Environment:** CivilDocs development preview

The desktop pilot entry screen renders the three proposed subscription tiers as distinct, immediately visible cards below the access area. Each card shows its plan name, ZMW price, core allowance and a disabled **Unavailable during pilot** control. The tier information is no longer hidden behind the pricing navigation text.

At a 375px mobile viewport, the document register, Terms gate, account-status panel and three plan cards stack in a readable order. The unavailable state remains explicit on each card, the entry action remains visible, and the appearance control remains reachable in the masthead. No horizontal overflow or clipped price-card content was observed in either check.

The appearance control was activated in the interactive preview while the toolkit workspace was open. It changed from **Appearance: Light** to **Appearance: Dark**, and the full visible workspace switched to the dark palette with readable document cards, controls and footer navigation. The remaining checks are persistence after reload and the unchecked-Terms validation cue.

The preview session and browser-local Terms record were cleared while preserving the saved theme, then the page was reloaded. The pilot-access gate returned with an unchecked Terms control, while the appearance control remained **Appearance: Dark**. This verifies persistent theme preference and confirms that access still depends on a current Terms record after reload.

Attempting pilot entry with the unchecked Terms control displayed the clear status message **“Accept the Pilot Terms and Conditions before entering the workspace.”** The Terms panel visibly changed to a red validation state; the implementation also applies the brief shake class, while reduced-motion users receive the red state without the shake. After correcting an older dark-mode blueprint asset reference revealed by the production build, the dark pilot screen, visible plan cards and validation state remained readable.

