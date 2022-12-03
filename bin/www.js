#!/usr/bin/env node
'use strict';

// # Application entry point.
import http from 'http';

import config from '#config';
import '#file';
import log from '#lib/logger';
import app from '#app';

import { init } from './init.js';

const host = config.isDev ? 'localhost' : '0.0.0.0';
const port = config.port;
app.set('port', port);

const server = http.createServer(app);

const start = () => {
  server.listen(port, host, () => {
    log.info(`Running -> Listening on port : ${port}`);
  });
};

init()
  .then(start)
  .catch((e) => {
    log.fatal({ e });
  });

process.on('SIGINT', process.exit);
