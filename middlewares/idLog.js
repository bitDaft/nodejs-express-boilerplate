import { v4 as uuidv4 } from 'uuid';

import { _baseLogger } from '#lib/logger';
import { loggingStorage } from '#lib/asyncContexts';

export const idLogsMiddleware = async (req, res, next) => {
  const child = _baseLogger.child({ requestId: uuidv4() });
  const store = new Map();
  store.set('logger', child);

  return loggingStorage.run(store, next);
};
