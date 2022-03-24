import pino from 'pino';

import config from '#config';
import { loggingStorage } from '#lib/asyncContexts';

let pinoConfig = {
  level: 'info',
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

if (config.NODE_ENV === 'development') {
  pinoConfig.level = 'debug';
  pinoConfig.transport.target = 'pino-pretty';
  pinoConfig.transport.options = {
    colorize: true,
    levelFirst: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'levelname,requestId',
    customLevels: Object.keys(config.customLevels).reduce(
      (str, key) => `${str}${key}:${config.customLevels[key]},`,
      ''
    ),
    customColors: Object.keys(config.customColors).reduce(
      (str, key) => `${str}${key}:${config.customColors[key]},`,
      ''
    ),
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
