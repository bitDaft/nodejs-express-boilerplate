#!/usr/bin/env node
'use strict';

// # Application entry point.
import http from 'http';

import '#file';
import config from '#config';
import log from '#lib/logger';
import app from '#app';

const port = config.port;
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  log.info('Running -> Listening on port : ' + port);
});

process.on('SIGINT', process.exit);
