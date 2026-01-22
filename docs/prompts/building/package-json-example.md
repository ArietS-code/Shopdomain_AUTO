# package-json-example.md

Authoritative `package.json` template (placeholders remain for replacement). Copy exactly, replacing ONLY the `{{placeholder}}` values. Do not alter ordering, add/remove fields, or change versions unless upgrading intentionally.

```json
{
  "name": "{{application_name}}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">={{node_version}}",
    "npm": ">={{npm_version}}"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test:unit": "jest --passWithNoTests",
    "test:coverage": "jest --coverage",
    "lint": "eslint . --ext .ts,.vue",
    "lint:style": "stylelint \"src/**/*.{css,scss,vue}\"",
    "format": "prettier --write .",
    "typecheck": "vue-tsc --noEmit"
  },
  "dependencies": {
    "axios": "^1.7.0",
    "vue": "^3.5.0",
    "vue-router": "^4.3.0",
    "vuex": "^4.1.0"
  },
  "devDependencies": {
    "@types/jest": "^29.5.0",
    "@types/node": "^20.11.0",
    "@vitejs/plugin-vue": "4.6.2",
    "@vue/test-utils": "^2.4.0",
    "@vue/vue3-jest": "^29.2.3",
    "cross-env": "^7.0.3",
    "eslint": "^9.0.0",
    "eslint-plugin-vue": "^9.0.0",
    "husky": "^9.0.0",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.2.0",
    "sass": "^1.77.0",
    "stylelint": "^15.11.0",
    "stylelint-config-html": "^1.1.0",
    "stylelint-config-standard": "^34.0.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.4.0",
    "vite": "5.4.10",
    "vite-plugin-css-injected-by-js": "^3.2.0",
    "vite-svg-loader": "^5.1.0",
    "vue-tsc": "^2.0.0"
  },
  "lint-staged": {
    "*.{ts,vue,js,json,md}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,vue}": ["stylelint --fix", "prettier --write"]
  }
}
```

Instructions:
1. Replace `{{application_name}}`, `{{node_version}}`, and `{{npm_version}}`.
2. Do not remove `typecheck` or any QA tooling.
3. If upgrading dependency versions, reflect same changes in build documentation.