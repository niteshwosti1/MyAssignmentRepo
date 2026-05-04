# Use an official node and apline image as the base image
FROM node:18-alpine

#Create a non-root user to run the application
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the application code to the working directory
COPY server.js ./

# Set permissions to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to the non-root user
USER appuser

# Dynamically set the port from environment variable or default to 3000
ARG PORT=3000
ENV PORT=${PORT}

#Document the port the application will run on
EXPOSE ${PORT}

# Health check to ensure the application is running and responsive
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -qO- http://localhost:${PORT}/health||exit 1

# Command to run the application
CMD ["node","server.js"]

