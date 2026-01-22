yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
# prettier-ignore-example.md

Authoritative `.prettierignore` content. Copy exactly.

```text
# Build output
/dist
/.vite-cache

# Dependencies
/node_modules

# Coverage reports
/coverage

# Lock & logs
package-lock.json
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Env files
.env.local
.env.*.local

# Generated assets
*.svg

# IDE/editor
.idea/
.vscode/
.DS_Store

# Misc
*.swp
```

Agent Instructions:
- Generate `.prettierignore` from this example (remove markdown wrapper).
