FROM node:18

WORKDIR /app/
COPY . .
RUN npm install

ENV NODE_ENV=production

CMD npm run build \
  && npm run start
