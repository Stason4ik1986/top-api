FROM node:14-alpine
WORKDIR /www/app
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build
RUN npm prume --production 
CMD ["node", "./dist/main.js"]