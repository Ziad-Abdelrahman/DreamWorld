FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install -g ts-node typescript
COPY . .

EXPOSE 3000
CMD ["npm", "start"]
