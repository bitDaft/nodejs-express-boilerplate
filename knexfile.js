import config from './config/index.js';

export const generateKnexConfig = (conf, id = 0) => {
  return {
    client: conf.client,
    debug: conf.debug || false,
    connection: {
      host: conf.host,
      user: conf.user,
      password: conf.pass,
      database: conf.db,
      timezone: 'Z',
    },
    pool: {
      min: conf.poolMin || 2,
      max: conf.poolMax || 10,
    },
    userParams: {
      client: conf.client + id,
    },
  };
};

export default async () => {
  const autoConf = config.db[config.d];
  return {
    [config.NODE_ENV]: {
      ...generateKnexConfig(autoConf),
      migrations: {
        tableName: '__knex_migrations',
        directory: `./database/migrations/${config.d}`,
        stub: `./database/migrations/stub`,
      },
      seeds: {
        directory: './database/seeds',
      },
    },
  };
};
