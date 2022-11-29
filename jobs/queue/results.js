import _BaseQueue from './base.js';

class ResultsQueue extends _BaseQueue {
  constructor() {
    super('results');

    this.queueEvents.on('completed', ({ jobId, returnvalue }) => {});
    this.queueEvents.on('failed', ({ jobId, failedReason }) => {});
    this.queueEvents.on('progress', ({ jobId, data }) => {});
  }
}

const resultsQueue = new ResultsQueue();

export default resultsQueue;
