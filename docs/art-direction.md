# Art direction

This document records how I chose the visual concept for my portfolio: the brief, three directions I explored, how I compared them, the one I built, and the revisions that keep it from reading as a template.

## 1. Brief

| | |
|---|---|
| **Profile** | A software engineer with six years of professional Java (Spring Boot microservices, Oracle SQL and PL/SQL, OpenShift), applying for AI training and AI evaluation work, with software engineering roles as a second target. |
| **Primary job of the site** | Let a recruiter understand in under a minute who I am, which AI-training tasks my experience supports, and where each claim can be checked. |
| **Audiences** | 1. Recruiters on AI-training platforms who are skimming. 2. Technical evaluators looking for verifiable evidence. 3. Designers and front-end engineers judging the build itself. |
| **Constraints** | Every claim has to trace back to my résumé or to a public source. No invented metrics, no AI experience I don't have. Static hosting, fast on mobile networks, keyboard and touch friendly, `prefers-reduced-motion` respected, English first with a Spanish version. |

My own work gives the visual vocabulary. Evaluating AI output means **reading carefully, marking what is wrong, explaining it, and grading against criteria**. My day job is the same activity: code review, migration work where APIs change under you, verifying data before touching production, tracing incidents to a root cause, writing it all down.

## 2. Three directions

### Direction A: "Proof", an annotated review copy

**Idea.** The page reads like a document someone reviewed carefully. Claims sit in a main column; the margin carries the reviewer's notes: what a term means, where a claim can be checked, what is confidential and why it can't be shown. Machine-set code gets *human* marks: hand-drawn circles and underlines in review red. The contrast between rigid typeset output and an irregular human mark is the concept: a person in the loop, judging machine output.

| Token | Hex | Role |
|---|---|---|
| Proof paper | `#EEF0F3` | Page. Cool grey, deliberately not cream. |
| Sheet | `#FFFFFF` | The code sheet under review. |
| Ink | `#171C26` | Text. Blue-black, like a pen's ink. |
| Review red | `#B8322A` | Errors only. |
| Fix green | `#1B7149` | Corrections only. |
| Evidence blue | `#2948AE` | Links, provenance and focus. |

- **Type.** Newsreader (display and the italic voice of margin notes), Public Sans (body and interface; it was drawn for the U.S. Web Design System, a quiet nod to my years in digital-government software), JetBrains Mono for code only (IntelliJ's default face: what a Java engineer actually reads code in).
- **Composition.** Left-aligned twelve-column grid: main column of seven columns (65–75 characters per line), margin rail of four. Below 1000px the margin notes drop under the block they annotate, indented behind a coloured rule.
- **Imagery.** No photos and no stock. The only graphics are the review marks, which are generated to fit the measured position of each flagged token.
- **Hero.** Name, a one-sentence thesis, and a constructed example: a plausible AI-generated Spring Security config for Spring Boot 3, with four errors circled and explained in the margin, each explanation linked to official Spring documentation. A two-option control swaps the answer for the corrected code.
- **Motion.** One orchestrated moment: on first view the marks draw themselves in reading order. After that, motion only answers the visitor: switching to the corrected code rewrites the lines top to bottom; hovering or focusing a note highlights the phrase it annotates.
- **Evidence.** Case studies are written as review documents: context, problem, my part, decisions, outcome, with the margin saying what is public and what is not.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Gonzalo Palavesino     AI work  Experience  Selected work  Contact   CV  ES │
├────────────────────────────────────────────────┬─────────────────────┤
│ Gonzalo Palavesino                             │ Now: NTT DATA,      │
│ Software engineer. Java, Spring Boot, Oracle.  │ since Nov 2021      │
│                                                │ Mendoza, AR (UTC−3) │
│ I find what's wrong in code                    │ Spanish native,     │
│ and write down why.                            │ English B2          │
│ Intro paragraph                                │                     │
│ [Email me]  [Read the CV]  LinkedIn  GitHub    │                     │
│ ┌ Constructed example ──────────────────────┐  │ ① javax → jakarta   │
│ │ 1 import (javax.servlet)…               ① │  │ ② adapter removed   │
│ │ 5 class … (extends WebSecurityConfig…)  ② │  │ ③ old DSL           │
│ │ 9   http.(authorizeRequests())          ③ │  │ ④ antMatchers gone  │
│ │ (● Model answer   ○ After review)         │  │                     │
│ └───────────────────────────────────────────┘  │                     │
└────────────────────────────────────────────────┴─────────────────────┘
```

**Risks.** Margin layouts collapse badly if done with absolute positioning; the mobile version must be designed, not left over. The hand-drawn marks need measuring and re-measuring when fonts load or the viewport changes.

### Direction B: "Changelog", a career as version history

**Idea.** The career read as a changelog: releases, diffs, an "Unreleased" section at the top that says honestly what I'm moving toward (AI evaluation) without pretending it has shipped. The vocabulary of version control (added, changed, fixed, removed) structures every section.

| Token | Hex | Role |
|---|---|---|
| Page | `#FFFFFF` | Background |
| Graphite | `#1F2328` | Text |
| Slate | `#59636E` | Secondary text, version gutter |
| Removed | `#CF222E` on `#FFEBE9` | Old lines |
| Added | `#1A7F37` on `#DAFBE1` | New lines |
| Link | `#0969DA` | Links and focus |

- **Type.** One grotesk (Hanken Grotesk) for everything, monospace for code and version tags.
- **Composition.** A single 720px column with a narrow left gutter for dates and version numbers, like line numbers in a diff.
- **Imagery.** None; diff blocks are the graphics.
- **Hero.** The headline is a diff: an old title struck through and a new one typed in.
- **Motion.** Lines resolve from removed to added as sections scroll in; a commit-graph line runs down the gutter.
- **Evidence.** Each job is a release with Added / Changed / Fixed lists.

```
┌────────────────────────────────────────────┐
│ ## Unreleased                              │
│ + AI training & evaluation (looking)       │
│ ─────────────────────────────────────────  │
│ 2021.11 │ NTT DATA                          │
│         │ + Led Java 11→17, Boot 2→3       │
│         │ ~ Planned Angular 14→19          │
│ 2020.05 │ CumbreSoft                        │
│         │ + ZK Framework apps, BPM         │
└────────────────────────────────────────────┘
```

**Risks.** The palette and gutter are close to GitHub's own interface, so it reads as a clone. Diff syntax is insider language for non-technical recruiters. Scroll-tied diffs everywhere turn into noise.

### Direction C: "Trace", observability as a frame

**Idea.** Borrowed from the production work I do in Kibana and Dynatrace: the career rendered as a distributed trace. Each role is a span on a real time axis (Dec 2019 to today, with the real gap between the internship and CumbreSoft); child spans hold the key projects; selecting one opens an incident-style report: signal, root cause, fix, verification.

| Token | Hex | Role |
|---|---|---|
| Graphite | `#15181D` | Page |
| Panel | `#1D2128` | Detail panes |
| Text | `#E3E6EA` | Text |
| Muted | `#9AA3AF` | Axis, labels |
| Amber | `#E3A33B` | Work spans |
| Teal | `#3BB8A8` | Education spans |

- **Type.** IBM Plex Sans and IBM Plex Mono, the look of an engineering tool.
- **Composition.** A full-width waterfall chart, then a master and detail layout.
- **Imagery.** Data visualisation only, built from real dates; nothing invented.
- **Hero.** The trace draws itself span by span up to a "now" cursor.
- **Motion.** Spans grow along the axis; a crosshair follows the pointer; selecting a span expands its report.
- **Evidence.** Child spans open structured incident-style reports.

```
┌──────────────────────────────────────────────────────────────┐
│ 2019     2020     2021     2022     2023     2024  2025  2026│
│ ▌intern                                                      │
│      ▐████ CumbreSoft ███▌                                   │
│                       ▐█████████ NTT DATA ████████████████▶ now│
│                        └─ migration ─┘  └─ Oracle loads ─┘    │
├──────────────────────────┬───────────────────────────────────┤
│ span list                │ detail: signal / cause / fix      │
└──────────────────────────┴───────────────────────────────────┘
```

**Risks.** A dark multicolour dashboard is the generic "tech portfolio" look. A chart-first hero makes recruiters decode a visual before they get the plain answer. Waterfalls are hard to make readable at 360px.

## 3. Comparison

| Criterion | A: Proof | B: Changelog | C: Trace |
|---|---|---|---|
| Recruiter understands the profile in the first screen | High: plain sentences first, facts in the margin | Medium: diff syntax in the way | Low: chart before words |
| Evidence a technical evaluator can check | High: claims carry their source in the margin | Medium | Medium |
| Fit with AI evaluation work | High: annotating and grading *is* the task | Medium | Medium: debugging, not grading |
| Distinctiveness | High | Low: reads as GitHub | Medium: dashboards are common |
| Makes honesty visible | High: "not public" and "not claiming" are notes | Medium: "Unreleased" | Low |
| Mobile robustness | Medium: needs a designed collapse | High | Low |
| Runtime cost | Low: one measured SVG overlay | Low | Medium: chart, crosshair, layout animation |

These ratings are my own design judgement, not measurements.

## 4. Decision: Direction A, "Proof"

It is the only direction where the visual language *is* the job being applied for. A recruiter sees a person catching what a model got wrong before reading a word of the résumé, and a technical evaluator can follow every claim to its source. It also turns the brief's honesty requirement into a feature: the margin is where the site says what is confidential, what is a personal project, and what is not being claimed.

From C, one quiet element was kept: the experience section opens with a small timeline drawn from the real role dates. It is static and encodes tenure, including the gap between roles.

## 5. Reviewing the plan against generic defaults

Before building, I checked the plan against the patterns template sites tend to fall into. What changed:

1. **Cream paper with a red pen** was the first instinct for a "reviewed document". Cream with a serif display is one of the most common template looks, so the paper became a cool grey and red was restricted to errors. Green means fixed, blue means evidence; no colour is decorative.
2. **Monospace uppercase labels** ("SOURCE:", "NOTE:") were the first instinct for margin notes. Both are template tells. Notes now open with a short italic serif lead-in in sentence case ("Not public.", "In short."), the way a person annotates.
3. **Pill chips for skills** were replaced by grouped text runs ordered by evidence: daily work, also used, earlier roles, personal projects. The grouping says more than chips could.
4. **Fade-and-rise on every section** was removed. There is one orchestrated moment (the marks drawing in); everything else stays still until the visitor does something.
5. **A split hero** (big name left, code right) is the default developer-portfolio composition. The hero instead uses the same main and margin grid as the rest of the page, so the annotation system is established on the first screen and the recruiter's key facts sit in the margin.
6. **Numbered section markers** (01 / 02 / 03) were not used, because sections are not a sequence. Numbers appear only on the review findings, which do follow the code in reading order.
7. **Arrows on links and buttons, middle-dot meta strings, all-caps eyebrows** were all avoided in the copy and components.

## 6. System

### Colour

Light and dark themes share semantic tokens (`src/styles/tokens.css`). Every text colour was checked for WCAG contrast before it was committed (measured with the WCAG relative-luminance formula):

| Pair (light) | Ratio | Pair (dark) | Ratio |
|---|---|---|---|
| ink on paper | 14.95 | ink on paper | 15.06 |
| secondary ink on paper | 6.67 | secondary ink on paper | 8.87 |
| review red on paper | 5.21 | review red on paper | 7.73 |
| fix green on paper | 5.25 | fix green on paper | 9.51 |
| evidence blue on paper | 6.99 | evidence blue on paper | 8.29 |

### Type

| Role | Face | Size (desktop / mobile) |
|---|---|---|
| Thesis | Newsreader 380, optical size display | 64 / 40 px |
| Name (h1) | Newsreader 500 | 28 / 24 px |
| Section heading (h2) | Newsreader 450 | 40 / 30 px |
| Item heading (h3) | Newsreader 500 | 24 / 22 px |
| Body | Public Sans 400 | 18 / 17 px, line height 1.6 |
| Margin note | Newsreader 400, italic lead-in | 16 px, line height 1.5 |
| Code | JetBrains Mono 400 | 14 / 13 px |

Sizes follow a classical scale (14, 16, 18, 24, 28, 40, 64), not a fixed ratio.

### Motion

| Motion | Trigger | Why it exists | Reduced motion |
|---|---|---|---|
| Review marks draw in, in reading order, with their note numbers lighting up | First time the example scrolls into view | Shows the act of reviewing; the single orchestrated moment | Marks appear already drawn |
| Lines rewrite top to bottom when switching to the corrected code | Visitor picks "After review" | Shows exactly what changed | Instant swap |
| Annotated phrase gets a highlighter sweep | Hover or keyboard focus on its note, or the reverse | Connects a claim with its evidence | Highlight appears without the sweep |
| "Copied" confirmation on the email button | Visitor copies the email | Confirms an action that is otherwise invisible | Kept: it is text, not movement |

Nothing animates on its own after the first moment. No parallax, no particles, no scroll-jacking.

## 7. What changed while building it

Reviewing the built pages in a browser changed a few things in the plan above:

- **No animation library.** Every motion in the table is a CSS transition or keyframe animation, so Motion for React was evaluated and left out (it would have added about 29 KB gzip). See `architecture.md`.
- **Notes in roman, lead-ins in italic.** Whole notes set in italic were tiring to read past two lines; only the lead-in ("Not public.", "In short.") stays italic.
- **Numbers wait dimmed.** When the example starts below the fold, the draw-in waits until it is on screen. The margin notes are often visible before the code, so their numbers wait at low opacity and light up as each mark lands, instead of the notes looking unnumbered.
- **Marks sized from the font, not the DOM.** Because code is monospaced, each mark's size is known at build time (0.6em per character), confirmed in the browser to the third decimal.
- **Layout fixes from the screenshots:** header, content and footer now share the same edges; on phones the rubric puts each result under its criterion instead of squeezing both onto one line.
