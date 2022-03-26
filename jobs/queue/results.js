import _BaseQueue from './base.js';

class ResultsQueue extends _BaseQueue {
  constructor() {
    super('results');

    this._queueEvents.on('completed', ({ jobId, returnvalue }) => {});
    this._queueEvents.on('failed', ({ jobId, failedReason }) => {});
    this._queueEvents.on('progress', ({ jobId, data }) => {});
  }
}

const resultsQueue = new ResultsQueue();

export default resultsQueue;
