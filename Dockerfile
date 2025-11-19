# ---------- Etapa 1: Build ----------
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Etapa 2: Runtime ----------
FROM node:20-slim AS runner

WORKDIR /app

# Usuario sin privilegios (buena práctica)
RUN addgroup --system appgroup && adduser --system appuser --ingroup appgroup

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY swagger ./swagger
# Si quieres que la DB vaya dentro de la imagen:
COPY restaurants.db ./restaurants.db

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
USER appuser

CMD ["node", "dist/index.js"]