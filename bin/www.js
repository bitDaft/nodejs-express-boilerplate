#!/usr/bin/env node
'use strict';

// # Application entry point.
import http from 'http';

import '#file';
import config from '#config';
import log from '#lib/logger';
import app from '#app';

import { init } from './init.js';

const port = config.port;
app.set('port', port);

const server = http.createServer(app);

const start = () => {
  server.listen(port, () => {
    log.info(`Running -> Listening on port : ${port}`);
  });
};

init()
  .then(start)
  .catch((e) => {
    log.fatal({ e });
  });

process.on('SIGINT', process.exit);
