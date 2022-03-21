import { AsyncLocalStorage } from 'async_hooks';

export const loggingStorage = new AsyncLocalStorage();