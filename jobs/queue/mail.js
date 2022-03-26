import _BaseQueue from './base.js';

class MailQueue extends _BaseQueue {
  constructor() {
    super('mail');
  }
}

const mailQueue = new MailQueue();

mailQueue.queue.on('completed', ({ jobId, result }) => {});
mailQueue.queue.on('failed', ({ jobId, err }) => {});
mailQueue.queue.on('progress', ({ jobId, progress }) => {});

export default mailQueue;
