FROM node:20-alpine

WORKDIR /app

# Install dependencies based on preferred package manager
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Expose the standard Vite dev port
EXPOSE 5173

# Vite requires host 0.0.0.0 to be accessible within docker
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
