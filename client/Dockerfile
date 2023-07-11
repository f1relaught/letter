FROM node:alpine as builder

WORKDIR '/app'

COPY package.json .

RUN npm install

COPY . .

RUN npm run build


# Start with the official Nginx base image
FROM nginx

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the Nginx configuration file
COPY /nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose ports 80 and 443
EXPOSE 80
EXPOSE 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
