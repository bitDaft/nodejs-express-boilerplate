import { Queue } from 'bullmq';

import log from '#lib/logger';
import config from '#config';

class _BaseQueue {
  constructor(name) {
    if (typeof name !== 'string' || !name) {
      throw new Error(`Please provide a name for the queue`);
    }
    this._queue = new Queue(name, {
      connection: config.redis,
      ...config.queueOptions,
    });
    this.log = log.child({ queueName: name });
  }

  get queue() {
    if (!this._queue) {
      throw new Error('Please define the queue before using it');
    }
    return this._queue;
  }

  async add(jobName, jobData, jobOpts = {}) {
    if (!this.queue) {
      throw new Error('Please define the queue before adding jobs to it');
    }
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' job`);
    return this.queue.add(jobName, jobData, jobOpts);
  }
}

export default _BaseQueue;
