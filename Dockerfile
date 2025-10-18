# ---- Frontend build stage ----
FROM node:18 AS frontend
WORKDIR /frontend

# Install dependencies and build frontend
COPY ./frontend/package.json ./
RUN yarn install
COPY ./frontend/ .
RUN yarn build


# ---- Backend build stage ----
FROM node:18 AS backend
WORKDIR /backend

# Install dependencies and copy source
COPY ./backend/package.json ./
RUN yarn install
COPY ./backend/ .

# Copy built frontend into backend dist folder
COPY --from=frontend /frontend/dist ./dist/client

# Build backend
RUN yarn build


# ---- Runtime stage ----
FROM node:18-slim AS runtime
WORKDIR /app

# Copy only what's needed for runtime
COPY --from=backend /backend/dist ./dist
COPY --from=backend /backend/package.json ./

# Install production dependencies only
RUN yarn install --production

# Start backend
CMD ["node", "dist/index.js"]