FROM node:latest
WORKDIR /barcelonajs
RUN npm install && npm rebuild node-sass
CMD ["node", "serve.js"]
