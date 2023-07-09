# Use a Node.js base image
FROM node:alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client-side code to the container
COPY . .

# Expose the port that the client-side application will be served on
EXPOSE 3000

# Serve the built client-side application
CMD [ "npm", "run", "build" ]

# Nginx configuration

FROM nginx:alpine

COPY --from=build /app /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf

COPY ./nginx/default.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
