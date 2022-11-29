import { Queue, QueueEvents } from 'bullmq';

import log from '#lib/logger';
import config from '#config';

class _BaseQueue {
  constructor(name, opts = {}) {
    if (typeof name !== 'string' || !name) {
      throw new Error(`Please provide a name for the queue`);
    }
    const connection = config.redis;
    this.queue = new Queue(name, {
      connection,
      defaultJobOptions: { ...config.queueOptions, ...opts },
    });
    this.queueEvents = new QueueEvents(name, { connection });
    this.log = log.child({ queueName: name });

    process.on('exit', async () => await this.queueEvents.close());
  }

  async add(jobName, jobData, jobOpts = {}) {
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' job`);
    return await this.queue.add(jobName, jobData, jobOpts);
  }

  async addAndProcessASAP(jobName, jobData, jobOpts = {}) {
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' job`);
    return await this.queue.add(jobName, jobData, Object.assign(jobOpts, { lifo: true }));
  }

  async getAllRepeeatable() {
    return await this.queue.getRepeatableJobs();
  }

  async addRepeat(jobName, jobData, cron, jobOpts = {}) {
    if (typeof cron !== 'string' || !cron) {
      throw new Error('Please provide valid cron string');
    }
    this.log.info({ jobData, jobOpts }, `adding '${jobName}' repeatable job`);
    return await this.queue.add(
      jobName,
      jobData,
      Object.assign(jobOpts, { repeat: { pattern: cron } })
    );
  }

  async removeRepeat(name, cron, jobId) {
    this.log.info({ jobId }, `removing repeating job`);
    return await this.queue.removeRepeatable(name, { pattern: cron }, jobId);
  }
}

export default _BaseQueue;
