import path from 'path';
import { QueueScheduler, Worker } from 'bullmq';

import config from '#config';
import log from '#lib/logger';
import { __dirname } from '#lib/getFileDir';

const QUEUE_NAME = 'mail';
const connection = config.redis;

const processorFile = path.join(__dirname(import.meta), 'sandbox', 'mailProcessor.js');
const mailWorker = new Worker(QUEUE_NAME, processorFile, { connection, concurrency: 5 });

mailWorker.on('completed', (job, result) => {});
mailWorker.on('progress', (job, progress) => {});
mailWorker.on('failed', (job, err) => {});
mailWorker.on('error', (err) => {
  log.fatal({ err, workerName: QUEUE_NAME });
});

process.on('exit', async () => await mailWorker.close());

export default mailWorker;
