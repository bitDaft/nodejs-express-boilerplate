import { Queue, QueueScheduler } from 'bullmq';

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
    this._queueScheduler = new QueueScheduler(name);
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
    return await this.queue.add(jobName, jobData, jobOpts);
  }

  async addAndProcessASAP(jobName, jobData, jobOpts = {}) {
    if (!this.queue) {
      throw new Error('Please define the queue before adding jobs to it');
    }
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' job`);
    return await this.queue.add(jobName, jobData, Object.assign(jobOpts, { lifo: true }));
  }

  async addRepeat(jobName, jobData, cron, jobOpts = {}) {
    if (!this.queue) {
      throw new Error('Please define the queue before adding jobs to it');
    }
    if (typeof cron !== 'string' || !cron) {
      throw new Error('Please provide valid cron string');
    }
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' job`);
    return await this.queue.add(jobName, jobData, Object.assign(jobOpts, { repeat: cron }));
  }

  async removeRepeat(jobId) {
    // TODO: need to fix this fn to work properly
    if (!this.queue) {
      throw new Error('Please define the queue before adding jobs to it');
    }
    this.log.info({ jobId }, `removing repeating job`);
    return await this.queue.removeRepeatableByKey(jobId);
  }
}

export default _BaseQueue;
