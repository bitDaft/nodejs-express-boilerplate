import _BaseQueue from './base.js';

class GeneralQueue extends _BaseQueue {
  constructor() {
    super('general');

    this.queueEvents.on('completed', ({ jobId, returnvalue }) => {});
    this.queueEvents.on('failed', ({ jobId, failedReason }) => {});
    this.queueEvents.on('progress', ({ jobId, data }) => {});
  }
}

const generalQueue = new GeneralQueue();

export default generalQueue;
