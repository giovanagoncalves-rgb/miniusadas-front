FROM node:20-alpine AS builder

WORKDIR /app

# Instala pnpm (projeto usa pnpm workspace do Figma Make)
RUN npm install -g pnpm

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile

COPY . .

# VITE_API_URL precisa estar disponível em tempo de BUILD (Vite injeta no bundle).
# O Railway passa as variáveis do serviço como build args; o ARG abaixo as recebe.
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm build

# ── Serve estático com nginx leve ─────────────
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000
