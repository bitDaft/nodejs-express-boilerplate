import { Queue, QueueScheduler, QueueEvents } from 'bullmq';

import log from '#lib/logger';
import config from '#config';

class _BaseQueue {
  constructor(name, opts = {}) {
    if (typeof name !== 'string' || !name) {
      throw new Error(`Please provide a name for the queue`);
    }
    const connection = config.redis;
    this._queue = new Queue(name, {
      connection,
      defaultJobOptions: { ...config.queueOptions, ...opts },
    });
    this._queueEvents = new QueueEvents(name, { connection });
    this.log = log.child({ queueName: name });

    // ^define queuescheduler in each of child queues and workers only if they use delayed-kind-of or repeatable jobs
    // this._queueScheduler = new QueueScheduler(name, { connection });
    // process.on('exit', async () => await this._queueScheduler.close());

    process.on('exit', async () => await this._queueEvents.close());
  }

  get queue() {
    return this._queue;
  }

  async add(jobName, jobData, jobOpts = {}) {
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' job`);
    return await this.queue.add(jobName, jobData, jobOpts);
  }

  async addAndProcessASAP(jobName, jobData, jobOpts = {}) {
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' job`);
    return await this.queue.add(jobName, jobData, Object.assign(jobOpts, { lifo: true }));
  }

  async addRepeat(jobName, jobData, cron, jobOpts = {}) {
    if (typeof cron !== 'string' || !cron) {
      throw new Error('Please provide valid cron string');
    }
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' repeatable job`);
    return await this.queue.add(jobName, jobData, Object.assign(jobOpts, { repeat: cron }));
  }

  async removeRepeat(name, cron, jobId) {
    this.log.info({ jobId }, `removing repeating job`);
    return await this.queue.removeRepeatable(name, { cron }, jobId);
  }
}

export default _BaseQueue;
