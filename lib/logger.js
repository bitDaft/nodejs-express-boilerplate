import pino from 'pino';

import config from '#config';

let pinoConfig = {
  level: 'info',
  customLevels: {
    sql: 25,
  },
  transport: {
    target: 'pino/file',
    options: {
      destination: 1,
    },
  },
};

if (config.NODE_ENV === 'development') {
  pinoConfig.level = 'debug';
  pinoConfig.transport.target = 'pino-pretty';
  pinoConfig.transport.options = {
    destination: 1,
    colorize: true,
    levelFirst: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    // TODO: uncomment this once the merge custom props option has been merged into pino-pretty
    // customLevels : 'sql:25'
    // customColors : 'sql:yellow'
    // useOnlyCustomProps : false
  };
}

const log = pino(pinoConfig);

export default log;
