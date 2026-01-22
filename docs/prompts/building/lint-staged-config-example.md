# lint-staged-config-example.md

Authoritative Lint-Staged configuration.

```json
{
  "*.{ts,vue,js,jsx,tsx}": ["eslint --fix"],
  "*.{css,scss,vue}": ["stylelint --fix"],
  "*.{ts,vue,js,jsx,tsx,css,scss,json,md}": ["prettier --write"]
}
```

Agent Instructions:
- Generate `.lintstagedrc.json` from this JSON (remove markdown wrapper).
