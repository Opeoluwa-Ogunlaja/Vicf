# ---- Frontend build stage ----
ARG NODE_VERSION=20.10.0
FROM node:${NODE_VERSION} AS frontend
WORKDIR /frontend

# Install dependencies and build frontend
COPY ./frontend/package.json ./
RUN apt-get update && apt-get install -y libvips-dev
RUN yarn install --frozen-lockfile --include=optional
RUN yarn add sharp
COPY ./frontend/ .
RUN yarn build


# ---- Backend build stage ----
FROM node:${NODE_VERSION} AS backend
WORKDIR /backend

# Install dependencies and copy source
COPY ./backend/package.json ./
RUN yarn install --frozen-lockfile --include=optional
COPY ./backend/ .

# Copy built frontend into backend dist folder
COPY --from=frontend /frontend/dist ./dist/client

# Build backend
RUN yarn build


# ---- Runtime stage ----
FROM node:${NODE_VERSION}-slim AS runtime
WORKDIR /app

# Copy only what's needed for runtime
COPY --from=backend /backend/dist ./dist
COPY --from=backend /backend/package.json ./

# Install production dependencies only
RUN yarn install --production

# Start backend
CMD ["node", "dist/index.js"]