# CivilDocs Terms-Gated Pilot Entry Verification

## Pre-acceptance state

After clearing the browser-local pilot session and Terms acceptance record, the entry screen showed the orange **Use for free** button in a disabled state. The document-module register was absent from the public entry page. Sign in, Sign up, Google sign-in, and all three plan-tier actions remained visibly unavailable.

## Required release checks

The remaining checks are to confirm that accepting the Terms enables the free-entry button, that the button alone reveals the private document register, and that direct attempts to reach a form without the current Terms-gated session return to this entry screen.

## Terms acceptance and entry

Selecting the Terms checkbox changed the live status to **“Terms accepted. Use CivilDocs for free.”** and enabled the orange entry action. Selecting **Use for free** then revealed the six-module document register. The modules were therefore not shown before acceptance and appeared only after the explicit free-entry action.

## Direct workspace protection

With the document register open, the active session and browser-local Terms acceptance were cleared. A subsequent attempt to open CD-01 returned the browser to the Terms-gated entry screen instead of opening the form. This confirms the workspace-opening function independently protects every document module, rather than relying only on the welcome-screen layout.

## Responsive and automated validation

The 375×812 phone review preserved a readable Terms panel, full-width orange entry action, distinct unavailable account controls, technical visual, and all three unavailable plan tiers without clipping or overlap. The final validation completed successfully: **48 test files / 180 tests**, TypeScript checking, and a production build.

## Published release verification

After deployment propagation, the public CivilDocs domain served the revised entry screen. It showed the orange **Use for free** control, omitted all module rows before entry, retained Sign in, Sign up, Google sign-in, and plan-tier unavailable states, and preserved the Terms acceptance control. The published release is checkpoint `c87d6afc`.

