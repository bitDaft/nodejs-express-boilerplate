import pino from 'pino';

import config from '#config';
import { loggingStorage } from '#lib/asyncContexts';

let pinoConfig = {
  level: 'info',
  customLevels: {
    sql: 21,
  },
  transport: {
    target: 'pino/file',
    options: {
      destination: 1,
    },
  },
  formatters: {
    level(label, number) {
      return { level: number, levelname: label.toUpperCase() };
    },
  },
};

if (config.NODE_ENV === 'development') {
  pinoConfig.level = 'debug';
  pinoConfig.transport.target = 'pino-pretty';
  pinoConfig.transport.options = {
    colorize: true,
    levelFirst: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'levelname,requestId',
    // TODO: uncomment this once the merge custom props option has been merged into pino-pretty
    // customLevels : 'sql:25'
    // customColors : 'sql:yellow'
    // useOnlyCustomProps : false
  };
}

const _baseLogger = pino(pinoConfig);

const log = new Proxy(_baseLogger, {
  get(target, property, receiver) {
    target = loggingStorage.getStore()?.get('logger') || target;
    return Reflect.get(target, property, receiver);
  },
});

export { _baseLogger };
export default log;
