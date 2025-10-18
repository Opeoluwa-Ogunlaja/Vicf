












# ---- Frontend build stage ----
FROM node:18 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY frontend/ .
RUN yarn build

# ---- Backend build stage ----
FROM node:18 AS backend
WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn install --frozen-lockfile
COPY backend/ .

# Copy frontend dist into backend build folder
RUN mkdir -p ./dist/client && cp -r ../frontend/dist/* ./dist/client/

RUN yarn build

# ---- Runtime stage ----
FROM node:18-slim
WORKDIR /app
COPY --from=backend /app/backend/dist ./dist
COPY --from=backend /app/backend/package.json ./
RUN yarn install --production

CMD ["node", "dist/index.js"]

