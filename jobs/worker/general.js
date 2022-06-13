import path from 'path';
import { QueueScheduler, Worker } from 'bullmq';

import config from '#config';
import log from '#lib/logger';
import { __dirname } from '#lib/getFileDir';

import generalJobProcessor from './sandbox/generalProcessor.js';

const QUEUE_NAME = 'general';
const connection = config.redis;

// ^ there is some issue with using sandbox processor due to import issues
// TODO: Fix using sandbox processor, once update comes to fix import issue
const processorFile = path.join(__dirname(import.meta), 'sandbox', `${QUEUE_NAME}Processor.js`);
const worker = new Worker(QUEUE_NAME, generalJobProcessor, { connection });

// ^define queuescheduler in each of child queues and workers only if they use delayed-kind-of or repeatable jobs
// this._queueScheduler = new QueueScheduler(name, { connection });
// process.on('exit', async () => await this._queueScheduler.close());

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
