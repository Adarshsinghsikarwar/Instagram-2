# stage 1: build frontend

FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/backend
COPY backend/package.json ./
RUN npm install --omit=dev
COPY backend/ ./

FROM node:20-alpine AS production
WORKDIR /app/backend
ENV NODE_ENV=production

COPY --from=backend-builder /app/backend ./
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 3000
CMD ["node", "server.js"]