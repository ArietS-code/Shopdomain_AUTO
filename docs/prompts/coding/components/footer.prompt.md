# footer.prompt.md

## Purpose
Site-wide informational footer: navigation links, legal text, social placeholders.

## Props
| Name | Type | Default | Notes |
|------|------|---------|-------|
| brand | `string` | `APP_NAME` | Branding label; optional fallback eliminates missing required prop warnings when layout forgets to pass |
| groups | `Array<{heading:string;links:{label:string;href:string}[]}>` | `[]` | Link groups rendered in columns; empty -> only disclaimer & brand shown |

## Behavior
- Displays brand text (from prop or fallback) in a branding block.
- Renders grouped link lists; each group heading `<h4>` with uppercase styling.
- Disclaimer always displayed beneath groups.

## Accessibility
- `footer` element `role="contentinfo"` and dynamic `aria-label` derived from brand.
- List semantics preserved (`ul > li > a`).

## Edge Cases
- Empty groups array -> show only brand + disclaimer.

## Testing (Footer.spec.ts)
1. Renders brand text (explicit or fallback to APP_NAME when not passed).
2. Renders correct number of groups & links.
3. Hover style (can snapshot class change) optional.
4. Empty groups -> disclaimer still visible.
5. No missing required prop warning when mounted without brand.

Refer to `footer.example.md` for implementation reference (must be copied verbatim).

## Generation Parity Requirement
`src/components/Footer.vue` MUST be an exact copy of `footer.example.md`. Required steps:
1. Open example file before generation.
2. Copy all blocks without alteration (including comments and ordering).
3. Do not introduce additional links, props, or styling.
4. Update the example first if any change is desired; regenerate after example update to maintain parity.
