# layout.prompt.md

## Component: LayoutDefault.vue

### Purpose
Provide global application chrome (Header + routed content + Footer) for all views, eliminating duplication and ensuring consistent branding/navigation.

### Requirements
- File path: `src/layout/LayoutDefault.vue`
- Name: `LayoutDefault`
- Exports a default Vue SFC (Options API) with `name: 'LayoutDefault'`.
- Imports and renders `Header` and `Footer` components exactly once surrounding a single `<router-view />`.
- Provides `appName` from `APP_NAME` env constant to both components (both props optional with safe fallbacks but passed explicitly for clarity):
  - `<Header :title="appName" />`
  - `<Footer :brand="appName" />`
- Wraps routed content in a `<main>` element with `role="main"` and `aria-label="Main content"`.
- Applies a vertical layout flex column container: gap uses token `var(--space-6)`.
- Ensures `main` grows to fill remaining vertical space (for future sticky footer improvements).
 - STRICT PARITY: Generated file MUST exactly match `layout.example.md` structure (template, script, styles) except for permissible placeholder substitutions (none currently). No added wrappers, classes, or style overrides. If a change is required, update `layout.example.md` first.

### Template Structure
```
<div class="layout" aria-label="App layout">
  <Header :title="appName" />
  <main class="layout__main" role="main" aria-label="Main content">
    <router-view />
  </main>
  <Footer :brand="appName" />
</div>
```

### Script
- Fetch `APP_NAME` from `@/shared/EnvConsts`.
- Options API `data()` returns `{ appName }`.

### Styling (scoped)
- `.layout` display flex, flex-direction column, min-height 100vh.
- Gap between sections: `var(--space-6)`.
- `.layout__main` flex: 1 1 auto; display flex; flex-direction column.
- No global resets.
 - May apply `overflow-x: hidden` to prevent sporadic horizontal scroll after responsive header wraps; ensure header grid uses flexible minmax columns so content isn't clipped.
 - Do NOT import token SCSS manually; rely on global injection via Vite config.

### Accessibility
- Outer container labelled via `aria-label`.
- Semantic `main` region with explicit `role="main"` for reliability.
- Header & Footer components retain their own semantics (do not assign `role="banner"` or extra landmark duplication).

### Edge Cases
- If routed view fails to load (future async), layout still renders Header/Footer.
- Layout must not assume any props from children.
- No conditional rendering of Header/Footer (always present).

### Tests (suggested)
- Mount layout with a test stub for router-view and assert Header/Footer appear once.
- Assert `appName` text appears in both header and footer rendered output.

### Non-Goals
- Responsive drawer logic (lives inside `Header`).
- Dynamic footer links management.
- Theming toggles.

### Do Not
- Import views directly inside the layout.
- Emit layout-specific events (pure presentational wrapper).

