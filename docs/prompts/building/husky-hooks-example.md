# Husky Hooks Example Prompt

## Purpose
Manual Husky setup (prepare script removed) with explicit hook examples.

## Instructions
1. After dependencies install, initialize husky folder if not present:
```bash
mkdir -p .husky
```
2. Add executable hook files (ensure `chmod +x` if needed).

### pre-commit
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx lint-staged
```

### pre-push
```bash
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test:unit
```

## Agent Instructions
- Do NOT add a `prepare` script in `package.json`.
- Ensure `.husky/` directory exists and contains `pre-commit` & `pre-push`.
- If husky bootstrap script is missing, create minimal `./.husky/_/husky.sh` from husky docs or run `npx husky init`.
- Confirm hooks are executable.

## Validation Checklist
- `.husky/pre-commit` present, runs lint-staged.
- `.husky/pre-push` present, runs unit tests.
- No `prepare` script in `package.json`.
- README documents manual husky setup.
