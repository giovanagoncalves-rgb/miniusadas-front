FROM node:20-alpine AS builder

WORKDIR /app

# Instala pnpm (projeto usa pnpm workspace do Figma Make)
RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm build

# ── Serve estático com nginx leve ─────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
