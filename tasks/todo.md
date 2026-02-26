# Task Plan

## Objective
Write an English blog post that improves the provided workflow prompt, explains why each part matters in sentence-level detail, and includes image, source code, mermaid, and chart elements.

## Checklist
- [x] Review repository blog format and content conventions.
- [x] Draft a detailed content specification before writing.
- [x] Create a new blog post in `src/content/blog/`.
- [x] Include prompt improvement recommendations with rationale.
- [x] Add sentence-by-sentence explanation section.
- [x] Add source code examples (original vs improved prompt snippets).
- [x] Add mermaid diagram.
- [x] Add chart (visual comparison).
- [x] Add and reference an image asset.
- [x] Run build validation.
- [x] Complete review notes.

## Detailed Spec (Pre-Implementation Check-in)
1. **Audience & Goal**: readers who want more reliable AI-agent orchestration prompts.
2. **Core Structure**:
   - Problem framing
   - Why each rule exists (sentence-level guidance)
   - Improved prompt template
   - Visualized workflow (Mermaid)
   - Quantified quality comparison (chart)
   - Practical rollout checklist
3. **Required Elements**:
   - Embedded image from `public/images/blog/...`
   - Code fences for prompt snippets
   - Mermaid flowchart
   - Data chart (Mermaid pie or XY chart)
4. **Tone**: practical, detailed, and implementation-ready.

## Progress Log
- Plan drafted and verified against user requirements before implementation.
- Blog post authored with all required visual and code elements.
- Build succeeded with new content included in static generation.

## Review
### What changed
- Added a new English MDX blog post focused on improving orchestration prompts with detailed reasoning and reusable templates.
- Added a custom SVG hero/diagram image for the blog post.

### Validation evidence
- `npm run build:astro` completed successfully and generated the site.

### Notes
- No user correction occurred in this turn, so `tasks/lessons.md` was not updated.
