import path from 'path';
import { QueueScheduler, Worker } from 'bullmq';

import config from '#config';
import log from '#lib/logger';
import { __dirname } from '#lib/getFileDir';

import mailJobProcessor from './sandbox/mailProcessor.js';

const QUEUE_NAME = 'mail';
const connection = config.redis;

const processorFile = path.join(__dirname(import.meta), 'sandbox', `${QUEUE_NAME}Processor.js`);
const mailWorker = new Worker(QUEUE_NAME, mailJobProcessor, { connection });

mailWorker.on('completed', (job, result) => {});
mailWorker.on('progress', (job, progress) => {});
mailWorker.on('failed', (job, err) => {
  log.error({ err, workerName: QUEUE_NAME });
});
mailWorker.on('error', (err) => {
  log.fatal({ err, workerName: QUEUE_NAME });
});

process.on('exit', async () => await mailWorker.close());

export default mailWorker;
