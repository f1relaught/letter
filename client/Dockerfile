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

RUN npm run build

FROM nginx:alpine

# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=0 /app/dist /usr/share/nginx/html

COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]