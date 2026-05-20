# ---- Stage 1: Build ----
# Use the official Node.js image as the base image
FROM node:24-alpine AS builder

# Enable corepack for pnpm (no need for npm i -g pnpm)
RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and pnpm-lock.yaml to the working directory (better layer caching)
COPY package.json pnpm-lock.yaml ./

# Install ALL dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the NestJS application
RUN pnpm build

# ---- Stage 2: Runtime ----
FROM node:24-alpine AS runtime

# Set the working directory inside the container
WORKDIR /app

# Copy everything from builder
COPY --from=builder /app .

# Make the entrypoint script executable
RUN chmod +x docker-entrypoint.sh

# Expose the application port
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
