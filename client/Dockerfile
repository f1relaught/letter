# Use an official Node.js runtime as the base image
FROM node:alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app's dependencies in the container
RUN npm install

# Copy the rest of the app's files to the container
COPY . .

# Build the app
RUN npm run build

# Use an Nginx image to serve the app
FROM nginx:alpine

# Copy the build output from the previous stage to the Nginx container
COPY --from=0 /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file to the container
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80
