FROM node:18

WORKDIR /app
COPY package-lock.json package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm", "run", "start"]
