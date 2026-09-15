# CivilDocs Design Directions

## Approach 1

**Theme Name:** Field Notebook Functionalism

**Very Brief Intro:** A workmanlike engineering utility that prioritizes rapid document creation, explicit labels, and low-friction actions. Its visual language borrows from specification covers and site notebooks rather than a marketing site.

**Probability:** 0.04

## Approach 2

**Theme Name:** Drafting Board Minimalism

**Very Brief Intro:** A light technical interface where subtle blueprint marks and measured spacing communicate accuracy. The experience remains quiet so the documents, rather than the interface, remain the focus.

**Probability:** 0.07

## Approach 3

**Theme Name:** Site Office Utility

**Very Brief Intro:** A compact, information-dense work surface inspired by construction administration forms. It uses strong borders and direct controls to keep tasks legible under time pressure.

**Probability:** 0.02

# Chosen Direction: Field Notebook Functionalism

**Design Movement:** Swiss International Style interpreted through the practical layout conventions of civil-engineering specification sheets.

**Core Principles:** First, every visible element earns its place by helping the user choose, complete, or export a document. Second, hierarchy relies on spacing, labels, and restrained color rather than decoration. Third, controls should feel reliable and explicit, with native form semantics and clear error states. Fourth, document types must read as work categories, not as product features.

**Color Philosophy:** Navy establishes technical authority and stable information hierarchy; amber marks the single primary action and the distinctive drafting accent. Off-white surfaces lower visual fatigue, while red is reserved for conditions requiring correction.

**Layout Paradigm:** A narrow application ledger, aligned on a left edge, supports rapid scanning. The home view uses a functional card inventory and the form view becomes a focused single-column work sheet.

**Signature Elements:** A navy structural-arch mark crossed with an amber datum line; a restrained blueprint texture in the page background; solid rule lines that separate document metadata from controls.

**Interaction Philosophy:** Direct and unsurprising. Selecting a document opens its form; submitting either produces a downloadable PDF or explains the failure precisely. No decorative controls or hidden interaction states are introduced.

**Animation:** No decorative animation. Button press feedback is instantaneous and loading is represented by a simple textual status with a compact spinner.

**Typography System:** Arial and Helvetica system fonts are used for native-platform legibility and zero external dependencies. Titles are bold at 1.6rem; section titles are semibold at 1rem; labels are 0.82rem uppercase with moderately increased tracking.

**Brand Essence:** CivilDocs is a focused browser tool for engineers who need a usable first draft of a standard site document quickly, without account setup. Personality: dependable, direct, technical.

**Brand Voice:** Headlines are declarative and task-led; calls to action name the exact next action; microcopy is brief and factual. Examples: “Choose a document to begin.” and “Generate BOQ and download PDF.”

**Wordmark & Logo:** The mark is a structural arch with an amber drafting datum crossing it; the wordmark sets “Civil” in navy and “Docs” in amber in a compact, heavy sans-serif treatment.

**Signature Brand Color:** Datum Amber — #F4A300.

## Style Decisions

- The home view is treated as a **document register / field notebook ledger**, using document codes, rule lines, and compact metadata before descriptive copy.
- The wordmark is presented as an **engineering stamp**: compact heavy type, a larger structural-arch mark, and a clear Datum Amber rule.
- All visible instructions remain task-specific and factual, avoiding broad product claims.
- Emoji, novelty pictograms, and consumer-style icons are excluded; document identity is expressed with codes, labels, rule lines, and restrained technical marks.
- Home-page copy is task-led and factual: users choose a document, prepare a draft, review figures, and generate a PDF.
- The document register remains the primary visual object; the hero operates as a compact specification-sheet cover rather than a promotional landing section.

