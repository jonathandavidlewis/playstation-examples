FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY src ./src

# Expose port
EXPOSE 4000

# Set environment to production
ENV NODE_ENV=production

# Start the service
CMD ["node", "src/index.js"]
