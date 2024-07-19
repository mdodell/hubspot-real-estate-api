FROM node:18 AS development

WORKDIR /app

COPY package.json /app/package.json

# RUN apk add openssl3
RUN npm install

COPY . /app
RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "start"]
