import _BaseQueue from './base.js';

class MailQueue extends _BaseQueue {
  constructor() {
    super('mail');

    this.queueEvents.on('completed', ({ jobId, returnvalue }) => {});
    this.queueEvents.on('failed', ({ jobId, failedReason }) => {});
    this.queueEvents.on('progress', ({ jobId, data }) => {});
  }
}

const mailQueue = new MailQueue();

export default mailQueue;
