# eslint-config-example.md

Authoritative flat ESLint config template (Vue + JS/TS). Copy exactly.

```js
import vue from 'eslint-plugin-vue';
import js from '@eslint/js';

export default [
  js.configs.recommended,
  ...vue.configs['flat/essential'],
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off',
    },
  },
];
```

Agent Instructions:
- Generate `eslint.config.js` from this example (remove markdown wrapper).
- Ensure project root placement.