import pino from 'pino';

import config from '#config';
import { loggingStorage } from '#lib/asyncContexts';

const makeCustomStr = (custObj) =>
  Object.keys(custObj).reduce((str, key) => `${str}${key}:${custObj[key]},`, '');

let pinoConfig = {
  level: 'debug',
  customLevels: config.customLevels,
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

if (config.isDev) {
  pinoConfig.level = 'trace';
  pinoConfig.transport.target = 'pino-pretty';
  pinoConfig.transport.options = {
    colorize: true,
    levelFirst: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'levelname,requestId',
    customLevels: makeCustomStr(config.customLevels),
    customColors: makeCustomStr(config.customColors),
    useOnlyCustomProps: false,
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
