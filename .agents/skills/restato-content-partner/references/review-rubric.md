# Restato editorial review rubric

Use this rubric after the English MDX draft is complete and before final user approval. A numerical score may help prioritize edits, but hard blockers determine whether the article can proceed.

## Hard blockers

Any item below blocks approval and PR creation:

- A current fact, price, limit, version, model ID, API shape, or benchmark lacks a credible source.
- The article presents an inference, vendor claim, or unexecuted example as independently measured fact.
- It invents first-person experience, test output, customer results, or repository behavior.
- A code sample contradicts current official documentation or contains credentials or personal data.
- The frontmatter disagrees with `src/content/config.ts`.
- The title, description, or technical body is not in English without an explicit user exception.
- The new post substantially duplicates the search intent and conclusion of an existing post without adding a distinct promise.
- A changed internal link is broken.
- `npm run build` fails because of the change.
- TODOs, placeholder citations, or unresolved factual notes remain in the article.

## Review dimensions

### 1. Evidence and factual accuracy — 30 points

- Important claims are traceable to primary sources.
- Release dates, versions, limits, and prices include necessary scope and units.
- Vendor evaluations are attributed as vendor evaluations.
- Derived values state assumptions and were calculated with a tool.
- Analysis is clearly phrased as engineering interpretation.

### 2. Reader value and thesis — 20 points

- The target reader and problem are evident in the opening.
- The article has one clear, defensible thesis.
- Each section changes a decision, explains a mechanism, or enables an action.
- The conclusion gives a specific recommendation and boundary conditions.

### 3. Technical utility — 20 points

- Code, commands, diagrams, tables, or checklists are necessary and accurate.
- Examples use current syntax and realistic inputs.
- Execution or verification boundaries are disclosed.
- Security, cost, latency, maintenance, and failure modes are covered when relevant.

### 4. Editorial quality — 15 points

- The article follows the Restato English voice.
- Headings are sentence case and describe the section's purpose.
- Paragraphs flow naturally without AI-template transitions.
- Promotional language, repetition, and padding have been removed.
- First person appears only with evidence.

### 5. Discoverability and integration — 10 points

- Title and description express the reader benefit without clickbait.
- The opening naturally contains the topic and thesis.
- Tags are focused and consistent with the archive.
- Related Restato posts are linked where genuinely useful.
- The slug is stable, descriptive, and lowercase kebab-case.

### 6. Repository correctness — 5 points

- Frontmatter matches the live schema.
- MDX compiles.
- Expected route is generated.
- The diff contains only intended content and metadata changes.

## Decision

- **Approve:** no hard blockers and 85–100 points.
- **Revise:** no hard blockers but below 85, or the thesis/voice needs another pass.
- **Block:** one or more hard blockers.

User-specified topics are still researched even when their early topic score is low. This rubric evaluates the finished artifact; it does not override explicit user judgment about editorial direction.

## Review report template

```md
## Editorial review

- Decision: approve | revise | block
- Score: <0–100>
- Hard blockers: none | <list>

### Evidence checked
- <claim> — <source> — <result>

### Code and build
- Code verification: <command or documentation-only boundary>
- Build: `<command>` — <actual result>
- Route: <generated path or URL>

### Editorial edits
- <material edit and reason>

### Remaining uncertainty
- none | <precise unresolved item>
```
