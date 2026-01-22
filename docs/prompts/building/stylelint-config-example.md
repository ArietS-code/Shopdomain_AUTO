# stylelint-config-example.md

Authoritative Stylelint configuration (JSON). Copy exactly.

```json
{
  "extends": ["stylelint-config-standard", "stylelint-config-html"],
  "ignoreFiles": ["**/dist/**"],
  "plugins": [],
  "rules": {
    "color-hex-length": "short",
    "string-quotes": "double",
    "no-empty-source": null,
    "alpha-value-notation": "number",
    "comment-no-empty": true
  }
}
```

Agent Instructions:
- Generate `.stylelintrc.json` from this JSON (remove markdown wrapper).
- Place at project root.
