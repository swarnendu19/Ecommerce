# Stage 1: Build Stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all files and build the application
COPY . .
RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci --only=production

# Copy the built files from the build stage
COPY --from=builder /app/dist ./dist

# Set ownership and permissions
RUN chown -R node:node /app && chmod -R 755 /app

# Install PM2 globally
RUN npm install pm2 -g

# Copy PM2 ecosystem configuration file
COPY ecosystem.config.cjs .

# Change to the non-root user
USER node

# Expose the application port
EXPOSE 5513

# Start the application with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.cjs", "--env", "production"]
