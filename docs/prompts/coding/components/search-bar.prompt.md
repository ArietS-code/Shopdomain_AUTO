# search-bar.prompt.md

## Purpose
Emit sanitized product search term.

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| placeholder | `string` | "Search products" | Input placeholder |

## Behavior
- Two-way bound `term` string.
- On submit: trim term; if non-empty emit `search` with trimmed value.
- Keep term after submit (no clearing for iterative refinement).

## Accessibility
- Form `role="search"`.
- Input `aria-label="Search products"`.
- Submit button text "Search" (not icon-only).

## Testing (SearchBar.spec.ts)
1. Emission includes trimmed term.
2. Empty/whitespace-only submission emits nothing.
3. Default placeholder applied when prop omitted.

Refer to `search-bar.example.md` for baseline skeleton.

## Generation Parity Requirement
`src/components/SearchBar.vue` MUST be identical to `search-bar.example.md`. Steps:
1. Read example file before generation.
2. Copy template/script/style exactly (retain form role, aria-label, prop `placeholder`).
3. Do not convert to Composition API or rename events.
4. Any future modifications must be applied to the example first; regeneration then enforces parity.
