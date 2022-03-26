import path from 'path';
import { QueueScheduler, Worker } from 'bullmq';

import config from '#config';
import log from '#lib/logger';
import { __dirname } from '#lib/getFileDir';

const QUEUE_NAME = 'results';
const connection = config.redis;

const processorFile = path.join(__dirname(import.meta), 'sandbox', 'resultsProcessor.js');
const resultsWorker = new Worker(QUEUE_NAME, processorFile, { connection, concurrency: 5 });

resultsWorker.on('completed', (job, result) => {});
resultsWorker.on('progress', (job, progress) => {});
resultsWorker.on('failed', (job, err) => {});
resultsWorker.on('error', (err) => {
  log.fatal({ err, workerName: QUEUE_NAME });
});

process.on('exit', async () => await resultsWorker.close());

export default resultsWorker;
