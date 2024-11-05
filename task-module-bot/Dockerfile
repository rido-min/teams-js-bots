FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY src/ ./src/
COPY pages/ ./pages/
EXPOSE 3978
CMD [ "node", "src/index.js" ]