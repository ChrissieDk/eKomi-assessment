FROM node:18-alpine

WORKDIR /app

# Install serve to serve static files
RUN npm install -g serve

# Copy frontend files
COPY . .

# Expose the port serve will run on
EXPOSE 3000

# Start the static server
CMD ["serve", "-s", ".", "-l", "3000"]