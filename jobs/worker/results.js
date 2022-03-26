import path from 'path';
import { QueueScheduler, Worker } from 'bullmq';

import config from '#config';
import log from '#lib/logger';
import { __dirname } from '#lib/getFileDir';

import resultsJobProcessor from './sandbox/resultsProcessor.js';

const QUEUE_NAME = 'results';
const connection = config.redis;

const processorFile = path.join(__dirname(import.meta), 'sandbox', 'resultsProcessor.js');
const resultsWorker = new Worker(QUEUE_NAME, resultsJobProcessor, { connection });

resultsWorker.on('completed', (job, result) => {});
resultsWorker.on('progress', (job, progress) => {});
resultsWorker.on('failed', (job, err) => {
  log.error({ err, workerName: QUEUE_NAME });
});
resultsWorker.on('error', (err) => {
  log.fatal({ err, workerName: QUEUE_NAME });
});

process.on('exit', async () => await resultsWorker.close());

export default resultsWorker;
