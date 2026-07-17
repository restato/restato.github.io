# Interactive LLM Wiki Learning Experience — Design

**Date:** 2026-07-17  
**Status:** Approved  
**Route:** `/llm-wiki/`  
**Language:** English

## Objective

Build a premium, presentation-ready interactive learning page that helps a global audience understand three related ideas through direct manipulation rather than long-form exposition:

- **LLM Wiki:** Andrej Karpathy's pattern for compiling source material into a persistent, interlinked knowledge artifact that improves over time.
- **OpenWiki:** LangChain's open-source CLI for generating and maintaining agent-oriented wikis, especially for codebases and personal knowledge.
- **OKF:** Google Cloud's Open Knowledge Format, a portable Markdown and YAML convention for exchanging structured knowledge between producers and consumers.

The page should make the concepts understandable to complete beginners while allowing technical visitors to inspect file trees, Markdown, YAML metadata, commands, and source relationships. It should also create a credible desire to try the workflow in a real repository, research practice, or company.

## Product Positioning

The experience is an **Interactive Knowledge Lab** with cinematic scrollytelling and product-grade simulation. It is not a live upload service and will not call an LLM. All inputs and outputs are carefully precomputed examples.

The simulation must be honest about this boundary. It will be labeled as a guided simulation and explain that no files are uploaded. The interaction should still mirror the mental model and observable outputs of a real LLM Wiki workflow.

## Core Learning Model

Every section reinforces one concise relationship:

> LLM Wiki is the idea. OpenWiki is a tool that operationalizes it. OKF is a portable format for the resulting knowledge.

The user moves through six learning stages:

1. Experience the cost of scattered knowledge and disposable answers.
2. Compile source material into a persistent LLM-maintained wiki.
3. Repeat the pattern across an open-source repository, personal research notes, and a company knowledge base.
4. See how OpenWiki automates wiki generation and maintenance.
5. Explore how OKF structures and transports the knowledge.
6. Leave with a scenario-specific adoption path and official resources.

## Page Structure

1. **Hero:** “Your AI shouldn't rediscover what you already know.”
2. **Problem demonstration:** Scattered files, repeated retrieval, and answers that disappear.
3. **LLM Wiki explanation:** Sources become durable, linked Markdown knowledge.
4. **Knowledge Workbench:** A three-scenario, direct-manipulation simulation.
5. **RAG comparison:** Replay the same question against retrieval-only and compiled-wiki workflows.
6. **OpenWiki terminal:** Animate a realistic command sequence and growing file tree.
7. **OKF explorer:** Inspect frontmatter, reserved files, metadata, and portability.
8. **Architecture recap:** Idea → tool → format.
9. **Adoption guide:** Practical next steps for maintainers, researchers, and organizations.
10. **FAQ, glossary, sources, and CTA.**

## Scenario Design

### Open-source repository

- User question: “Where is authentication handled?”
- Sources: route, middleware, configuration, tests, and README fragments.
- Value moment: a new contributor follows a concise architecture page to the exact implementation and supporting evidence.

### Personal research

- User question: “Which papers disagree about scaling behavior?”
- Sources: papers, highlights, annotations, and experiment notes.
- Value moment: the wiki preserves a cited contradiction and updates the relevant concept page.

### Company knowledge

- User question: “How do we calculate weekly active users?”
- Sources: metric definitions, SQL fragments, meeting notes, incident history, and ownership records.
- Value moment: the agent retrieves the agreed definition, caveats, owner, and change history instead of synthesizing an answer from conflicting fragments.

Each scenario follows the same sequence: **before → organize → ask → preserve**.

## Interaction System

- **Scenario selector:** Switch all sources, questions, wiki outputs, and graph relationships.
- **Drag-to-compile workbench:** Move sample source cards into the compiler; mobile and keyboard users get an equivalent select-and-add flow.
- **Before/after lens:** Compare scattered inputs with the living wiki.
- **Knowledge graph:** Click, drag, zoom, and inspect relationships; provide a semantic list alternative.
- **Ask the wiki:** Choose prepared questions and replay RAG versus wiki retrieval side by side.
- **OpenWiki terminal:** Run a guided sequence and open generated Markdown files from a live-growing file tree.
- **OKF portability test:** Move a generated bundle between agent consumers and inspect both plain-language and raw YAML views.
- **Presentation mode:** Full-screen viewing, section navigation, progress indication, and optional guided autoplay.
- **Persistence:** Save the current scenario and learning progress locally; provide a reset control.

## Visual Direction

The visual character is a **premium scientific instrument**, not a generic AI landing page.

- Ink-black and warm-ivory foundations with electric violet, knowledge cyan, and signal amber accents.
- Editorial display typography paired with precise monospace metadata.
- Fine grids, translucent instrument panels, restrained noise, controlled glows, and meaningful connection lines.
- Motion communicates compilation, linking, retrieval, and portability. Decorative motion must never compete with comprehension.
- Dark and light themes are supported. Dark is the primary art direction for the immersive experience.
- Micro-interactions use short transform and opacity transitions; large sequences respect `prefers-reduced-motion`.

## Technical Architecture

Astro owns the route, metadata, structured data, sources, and non-JavaScript fallback. A focused React island owns the stateful learning simulation.

```text
src/pages/llm-wiki/index.astro
        │
        ├── SEO, structured data, static narrative and sources
        └── LlmWikiExperience.tsx
              ├── ScenarioSwitcher
              ├── SourceWorkbench
              ├── KnowledgeCompiler
              ├── KnowledgeGraph
              ├── RagComparison
              ├── OpenWikiTerminal
              ├── OkfExplorer
              └── PresentationControls
```

Scenario fixtures live in `src/data/llm-wiki/` and include source files, compilation events, wiki documents, graph relationships, questions, evidence, OKF metadata, and teaching notes. Types live alongside the feature or in `src/types/` depending on reuse.

No production API, file upload, authentication, or server storage is required. The existing static GitHub Pages deployment remains unchanged.

## Accessibility and Responsive Behavior

- All primary actions meet a 44×44 px touch target.
- Drag interactions have button and keyboard equivalents.
- Focus states are visible and tab order follows the learning sequence.
- Graph information is also available as a navigable text list.
- Text contrast meets WCAG AA and body text remains at least 16 px on mobile.
- Motion has a reduced-motion alternative.
- On small screens, the multi-panel workbench becomes a guided vertical sequence without horizontal overflow.
- With JavaScript disabled, visitors can still read the core explanation, scenario summaries, example output, glossary, and sources.

## Failure and Recovery States

- An incompatible sample source explains why it cannot yet be connected and how a real workflow would handle it.
- Every multi-step simulation can be paused, replayed, skipped, or reset.
- Scenario changes reset transient animation safely while preserving completed learning stages.
- Local storage failures degrade to in-memory state without blocking the experience.

## Testing and Verification

- Unit and interaction tests cover scenario switching, compilation stages, resets, question-to-evidence links, OKF views, and persistence.
- Accessibility checks cover semantic names, focus behavior, keyboard alternatives, and reduced motion.
- Responsive checks cover mobile, tablet, desktop, and presentation widths.
- Production verification includes Vitest, Astro build, and browser-based end-to-end visual inspection of the full learning journey.
- Visual issues, console errors, broken interactions, overflow, and layout shifts are corrected and retested before completion.

## Success Criteria

- A first-time visitor can accurately explain the idea/tool/format relationship after completing the experience.
- Each target audience recognizes a concrete problem from its own scenario.
- The page functions as both self-guided learning material and a polished classroom or company presentation.
- The interaction works without live services, secrets, uploaded data, or variable model output.
- The final result feels deliberate, credible, and visually exceptional without sacrificing accessibility or comprehension.

## Primary Sources

- Andrej Karpathy, “LLM Wiki,” GitHub Gist, 2026-04-04.
- LangChain, OpenWiki repository and OpenWiki 0.2 announcement, 2026-07-16.
- Google Cloud, “Introducing the Open Knowledge Format,” 2026-06-12.
- GoogleCloudPlatform Knowledge Catalog, OKF v0.1 specification.
