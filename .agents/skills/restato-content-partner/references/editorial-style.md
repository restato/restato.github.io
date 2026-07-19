# Restato English technical editorial style

## Golden sample

Use `src/content/blog/gpt-5-6-agent-engineering-production-guide.mdx` as the current reference for structure and voice. It is a style example, not evidence for future technical claims.

## Audience and language

- Write published technical articles in English.
- Assume the reader is a working software engineer or technical decision-maker.
- Planning conversation with direcision may be in Korean.
- Explain domain-specific terms, but do not teach basic programming unless the article targets beginners.

## Voice

- Informed, direct, practical, and mildly opinionated.
- Prefer plain verbs and concrete nouns over promotional adjectives.
- State the engineering consequence before cataloging features.
- Distinguish documented facts, derived values, and author analysis.
- Use first person only when repository history, test output, or user-provided experience supports it.
- Admit uncertainty precisely rather than weakening the entire article with generic disclaimers.

## Structure

A strong default structure is:

1. The operational problem and thesis
2. The technical change that matters most
3. A minimal implementation or architecture example
4. Decision criteria and trade-offs
5. Security, cost, latency, or maintenance constraints
6. A concrete evaluation or adoption plan
7. A conclusion with a specific recommendation
8. Primary-source references

Do not force this outline when a shorter or different structure better serves the reader.

## Prose rules

- Use sentence-case headings.
- Keep paragraphs focused on one idea.
- Vary paragraph length naturally; do not manufacture one-sentence drama.
- Use tables only when they help compare or choose.
- Use bold sparingly for the thesis or a critical warning.
- Prefer exact scope: “The API accepts up to X tokens” rather than “The model understands an entire repository.”
- Link claims to the most specific primary source available.
- End with a recommendation or next action, not generic optimism.

## Avoid

- “Let’s dive in,” “In today’s rapidly evolving landscape,” and similar chatbot openings
- “Game-changing,” “revolutionary,” “seamless,” “powerful,” and unsupported superlatives
- Immediate rhetorical question-and-answer patterns
- Rule-of-three padding and excessive bullet lists
- Feature inventories that do not change an engineering decision
- Vendor adjectives rewritten as independent conclusions
- Fake benchmarks, fake user experience, or fabricated execution results
- A generic “challenges and future outlook” section without specific constraints

## Code and commands

- Use the current documented SDK and API shape.
- Keep credentials in environment variables.
- State whether the example was executed, type-checked, or only checked against documentation.
- Omit optional or version-sensitive parameters unless verified.
- Prefer a short correct example over a comprehensive speculative one.
- Never include secrets, personal data, private email addresses, or live tokens.

## Final humanization pass

Before approval, read the article as continuous prose and remove:

- repeated sentence openings
- abstract significance claims
- unnecessary transitions
- duplicated conclusions
- excessive em dashes
- mechanical section symmetry
- phrases that sound like a vendor announcement or AI template

The article is ready when a skeptical engineer can identify the thesis, trace important facts, run or adapt the example, and understand when the recommendation does not apply.
