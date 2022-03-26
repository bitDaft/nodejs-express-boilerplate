import _BaseQueue from './base.js';

class ResultsQueue extends _BaseQueue {
  constructor() {
    super('response');
  }
}

const resultsQueue = new ResultsQueue();

resultsQueue.queue.on('completed', ({ jobId, result }) => {});
resultsQueue.queue.on('failed', ({ jobId, err }) => {});
resultsQueue.queue.on('progress', ({ jobId, progress }) => {});

export default resultsQueue;
