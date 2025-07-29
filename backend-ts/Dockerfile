# Stage 1: Builder
# Using 'slim' for a robust glibc-based build environment.
FROM node:20-slim AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm cache clean --force
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 10000 && \
    npm config set fetch-retry-maxtimeout 60000 && \
    npm ci
COPY . .
RUN npm run build

# Stage 2: Production
# This stage creates the final, provably correct container filesystem.
FROM node:20-slim AS production
WORKDIR /usr/src/app

# --- THE FINAL FIX ---
# Install the 'netcat' dependency required by our entrypoint script.
# This must be done as root before switching to the 'node' user.
# We update, install, and clean up in a single layer to keep the image small.
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy build artifacts and dependencies from the builder stage.
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Switch to the non-root user for security.
USER node

ENTRYPOINT ["./docker-entrypoint.sh"]
# Use the formally correct path now that the build process is fixed.
CMD ["node", "dist/main"]