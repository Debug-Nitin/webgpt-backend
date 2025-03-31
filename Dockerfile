FROM node:20-alpine

# Install PM2
RUN npm install pm2 -g

# Create app directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Expose ports
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Start command using PM2
CMD ["pm2-runtime", "ecosystem.config.cjs"]