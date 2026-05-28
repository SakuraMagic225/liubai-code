FROM node:20-alpine AS frontend-builder

WORKDIR /workspace
RUN corepack enable
COPY frontend/package.json frontend/pnpm-lock.yaml ./frontend/
RUN pnpm --dir frontend install --frozen-lockfile
COPY frontend ./frontend
RUN pnpm --dir frontend build

FROM nginx:1.27-alpine

COPY --from=frontend-builder /workspace/frontend/dist /usr/share/nginx/html
COPY deploy/nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template
EXPOSE 80 443
