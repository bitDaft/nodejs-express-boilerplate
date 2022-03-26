import _BaseQueue from './base.js';

class GeneralQueue extends _BaseQueue {
  constructor() {
    super('general');

    this._queueEvents.on('completed', ({ jobId, returnvalue }) => {});
    this._queueEvents.on('failed', ({ jobId, failedReason }) => {});
    this._queueEvents.on('progress', ({ jobId, data }) => {});
  }
}

const generalQueue = new GeneralQueue();

export default generalQueue;
