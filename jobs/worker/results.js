import path from 'path';
import { QueueScheduler, Worker } from 'bullmq';

import config from '#config';
import log from '#lib/logger';
import { __dirname } from '#lib/getFileDir';

import resultsJobProcessor from './sandbox/resultsProcessor.js';

const QUEUE_NAME = 'results';
const connection = config.redis;

const processorFile = path.join(__dirname(import.meta), 'sandbox', `${QUEUE_NAME}Processor.js`);
const worker = new Worker(QUEUE_NAME, resultsJobProcessor, { connection });

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
