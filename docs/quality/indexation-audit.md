# Indexation audit

Audited on 2026-07-23 against the production static build.

## Decisions

- **Keep:** 965 substantive, indexable pages passed unique metadata, minimum content, author/contact, and repeated-body checks.
- **Improve:** Nine localized tool catalogs received distinct titles and descriptions instead of duplicating their locale home page.
- **Improve:** The article and job aggregators received server-rendered headings and explanatory copy so they remain useful before client JavaScript loads.
- **Improve:** The LLM Wiki guide received a visible contact route.
- **Noindex:** 99 entries in the mechanically generated `ai-dev-playbook-002` through `ai-dev-playbook-100` series remain available at their URLs but are removed from listings and marked `noindex, nofollow`. Their shared body template does not justify separate search results.
- **Redirect:** Existing generated redirects remain excluded from content scoring and are covered by the site link validator.

## Result

`npm run audit:content` reports zero unreviewed findings. The audit runs after every production build in `npm run verify`.
