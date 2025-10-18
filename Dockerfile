# ---- Frontend build stage ----
FROM node:18 AS frontend
WORKDIR /frontend
COPY ./frontend/package.json ./
COPY ./frontend/yarn.lock ./  # optional
RUN yarn install --frozen-lockfile
COPY ./frontend/ .
RUN yarn build

# ---- Backend build stage ----
FROM node:18 AS backend
WORKDIR /backend
COPY ./backend/package.json ./
COPY ./backend/yarn.lock ./  # optional
RUN yarn install --frozen-lockfile
COPY ./backend/ .

# Copy frontend dist into backend build folder
COPY --from=frontend /frontend/dist ./dist/client

RUN yarn build

# ---- Runtime stage ----
FROM node:18-slim AS runtime
WORKDIR /app
COPY --from=backend /backend/dist ./dist
COPY --from=backend /backend/package.json ./
RUN yarn install --production --frozen-lockfile

CMD ["node", "dist/index.js"]
