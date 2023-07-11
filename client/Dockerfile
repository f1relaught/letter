FROM node:alpine as builder

WORKDIR '/app'

COPY package.json .

RUN npm install

COPY . .

RUN npm run build


FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY /nginx/test-default.conf /etc/nginx/conf.d/default.conf

COPY /etc/letsencrypt/live/ytzba.com/fullchain.pem /etc/nginx/certs/fullchain.pem
COPY /etc/letsencrypt/live/ytzba.com/privkey.pem /etc/nginx/certs/privkey.pem

EXPOSE 80 
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]