FROM node:18-alpine

RUN apk add dumb-init

ENV NODE_ENV=production

RUN mkdir -p /home/node/app/node_modules 

RUN chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

# the rest of the actual env will have to be passed during the run phase

RUN npm ci --only=production

RUN npm run FIX_ERR_REQUIRE_ESM_BULLMQ

COPY --chown=node:node . .

EXPOSE 5000

# running it like this will not allow the workers to also run
# but if the we run it via npm ctrl+c and such signals may not pass through to node process

CMD ["dumb-init", "node", "./bin/www.js"]
