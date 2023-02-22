import path from 'path';
import { Worker } from 'bullmq';
import fs from 'fs';

import config from '#config';
import log from '#logger';
import { __dirname } from '#lib/getFileDir';

const QUEUE_NAME = config.w;
const connection = config.redis;

// ^ there is some issue with using sandbox processor due to import issues
// ! Currently using a work around by manually patching the module via npm script to fix the import
const processorFile = path.join(__dirname(import.meta), 'sandbox', `${QUEUE_NAME}Processor.js`);
if (!fs.existsSync(processorFile)) {
  log.fatal('Unable to find the worker file ' + processorFile + '. Exiting...');
  process.exit();
}
const worker = new Worker(QUEUE_NAME, processorFile, { connection });

log.info('Worker for ' + QUEUE_NAME + ' has started');

worker.on('completed', (job, result) => {});
worker.on('progress', (job, progress) => {});
worker.on('failed', (job, err) => {
  log.error({ err, workerName: QUEUE_NAME });
});
worker.on('error', (err) => {
  log.fatal({ err, workerName: QUEUE_NAME });
});

process.on('exit', async () => await worker.close());

export default worker;
