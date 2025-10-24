FROM node:20-alpine

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/ ./

EXPOSE 8080

CMD ["npm", "run", "dev"]
