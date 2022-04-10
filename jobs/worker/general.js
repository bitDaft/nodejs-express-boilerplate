import path from 'path';
import { QueueScheduler, Worker } from 'bullmq';

import config from '#config';
import log from '#lib/logger';
import { __dirname } from '#lib/getFileDir';

import generalJobProcessor from './sandbox/generalProcessor.js';

const QUEUE_NAME = 'general';
const connection = config.redis;

const processorFile = path.join(__dirname(import.meta), 'sandbox', `${QUEUE_NAME}Processor.js`);
const generalWorker = new Worker(QUEUE_NAME, generalJobProcessor, { connection });

generalWorker.on('completed', (job, result) => {});
generalWorker.on('progress', (job, progress) => {});
generalWorker.on('failed', (job, err) => {
  log.error({ err, workerName: QUEUE_NAME });
});
generalWorker.on('error', (err) => {
  log.fatal({ err, workerName: QUEUE_NAME });
});

process.on('exit', async () => await generalWorker.close());

export default generalWorker;
