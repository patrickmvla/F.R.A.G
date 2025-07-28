#------------------------------------------------------------------------------------
# Stage 1: Builder
# This stage installs all dependencies (including devDependencies) and builds the
# TypeScript/JavaScript source code.
#------------------------------------------------------------------------------------
FROM node:20-alpine AS builder

# Set an environment variable to ensure all logs go to the standard output
ENV NODE_ENV=development

WORKDIR /usr/src/app

# Copy package files and install dependencies using npm ci for reproducible builds
COPY package*.json ./
# Use `npm ci` for faster, more reliable and reproducible installs
RUN npm ci

# Copy the rest of the source code. A .dockerignore file should be used to
# exclude unnecessary files like .git, node_modules, etc.
COPY . .

# Build the application
RUN npm run build

# After building, remove devDependencies to shrink the node_modules folder
# This prepares a clean node_modules for the production stage.
RUN npm prune --production

#------------------------------------------------------------------------------------
# Stage 2: Production
# This stage creates the final, lean production image. It takes the build
# artifacts and the pruned node_modules from the 'builder' stage.
#------------------------------------------------------------------------------------
FROM node:20-alpine

# Set the environment to production
ENV NODE_ENV=production
# Set a default port. Can be overridden at runtime.
ENV PORT=3000

# The official node:alpine image already includes a non-root user 'node'.
# We DO NOT need to create it, so the following line has been removed.
# RUN addgroup -S node && adduser -S node -G node

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json for metadata (e.g., for security scanners)
# Copy pruned node_modules and built application from the builder stage.
# Set ownership to the existing 'node' user. This is still required.
COPY --from=builder --chown=node:node /usr/src/app/package*.json ./
COPY --from=builder --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=node:node /usr/src/app/dist ./dist

# Switch to the non-root user
USER node

# Expose the port the app will run on
EXPOSE ${PORT}

# Command to run the application
CMD [ "node", "dist/main" ]