import { AsyncLocalStorage } from 'async_hooks';

export const loggingStorage = new AsyncLocalStorage();
export const dbInstasnceStorage = new AsyncLocalStorage();