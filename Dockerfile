FROM node:18

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

# the rest of the actual env will have to be passed during the run phase
ENV NODE_ENV=prodution

RUN npm ci

COPY --chown=node:node . .

EXPOSE 5000

CMD ["npm", "run", "prod:app"]
