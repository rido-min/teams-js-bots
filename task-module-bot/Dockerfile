FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY app/ ./app/
COPY pages/ ./pages/
EXPOSE 3978
CMD [ "node", "app/index.js" ]