import _BaseQueue from './base.js';

class MailQueue extends _BaseQueue {
  constructor() {
    super('mail');
  }
}

const mailQueue = new MailQueue();

export default mailQueue;
