# gitignore-example.md

Authoritative `.gitignore` content. Copy exactly.
Updated to include explicit recursive macOS metadata ignore (`**/.DS_Store`) so nested Finder files are excluded.

```gitignore
# Node dependencies
node_modules/
.npm/

# Build output
/dist/
/.vite-cache/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Coverage
/coverage/

# IDE/editor
.idea/
.vscode/
*.swp

# macOS Finder metadata (root + nested)
.DS_Store
**/.DS_Store
# Optional other macOS artifacts (uncomment if they appear)
# .AppleDouble
# .LSOverride

# Env files (local only; never commit secrets)
.env.local
.env.*.local

# If using pnpm store or yarn v3 cache, uncomment relevant ignores:
# .pnpm-store/
# .yarn/cache/
```

Agent Instructions:
- Generate `.gitignore` from this example (remove markdown wrapper).
