#!/usr/bin/env node
'use strict';

// # Application entry point.
import http from 'http';

import { knexMain, knexTenant } from '#conns';
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

const closeAllHandles = () => {
  log.info('closing HTTP server');
  server.close(() => {
    log.info('HTTP server closed');
  });
  log.info('closing Database connections');
  for (let key in knexMain) {
    let instance = knexMain[key];
    instance.destroy?.((conn) => {
      log.info('Closed db connection ' + conn.userParams.client);
    });
  }
  for (let key in knexTenant) {
    let instance = knexMain[key];
    instance.destroy?.((conn) => {
      log.info('Closed db connection ' + conn.userParams.client);
    });
  }
  process.exit();
};

process.on('SIGTERM', () => {
  log.info('SIGTERM signal received:');
  closeAllHandles();
});

process.on('SIGINT', () => {
  log.info('SIGINT signal received:');
  closeAllHandles();
});
