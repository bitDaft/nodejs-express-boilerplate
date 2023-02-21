#!/usr/bin/env node
'use strict';

// # Application entry point.
import http from 'http';

import config from '#config';
import '#file';
import log from '#logger';
import app from '#app';

import { init } from './init.js';

const host = config.isDev ? 'localhost' : '0.0.0.0';
const port = config.port;
app.set('port', port);

const server = http.createServer(app);

const start = () => {
  server.listen(port, host, () => {
    log.info(`Running -> Listening on: ${host}:${port}`);
  });
};

init()
  .then(start)
  .catch((e) => {
    log.fatal({ e });
  });

process.on('SIGTERM', () => {
  log.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    log.info('HTTP server closed');
    process.exit();
  });
});
