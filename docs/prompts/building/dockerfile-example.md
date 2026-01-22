# dockerfile-example.md

Authoritative multi-stage Dockerfile for build + preview.

```Dockerfile
# Stage 1: Build
FROM node:{{node_version}}-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime (static file server via nginx optional; for dev keep node base)
FROM node:{{node_version}}-alpine AS runtime
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 4173
CMD ["npx", "vite", "preview", "--host", "0.0.0.0"]
```

Agent Instructions:
- Generate `Dockerfile` exactly from this template (replace `{{node_version}}`).
- Use `npm install` for dependency installation (lockfile ensures reproducibility).