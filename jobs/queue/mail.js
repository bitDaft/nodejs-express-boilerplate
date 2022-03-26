import _BaseQueue from './base.js';

class MailQueue extends _BaseQueue {
  constructor() {
    super('mail');

    this._queueEvents.on('completed', ({ jobId, returnvalue }) => {});
    this._queueEvents.on('failed', ({ jobId, failedReason }) => {});
    this._queueEvents.on('progress', ({ jobId, data }) => {});
  }
}

const mailQueue = new MailQueue();

export default mailQueue;
