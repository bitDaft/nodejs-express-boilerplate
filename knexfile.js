import config from '#config';

export const generateKnexConfig = (conf, id = 0) => {
  id = '_' + id;
  switch (conf.client) {
    case 'mysql':
    case 'mysql2':
      return getMysqlConfig(conf, id);
    case 'sqlite3':
    case 'better-sqlite3':
      return getSqlite3Config(conf, id);
    case 'pg':
      return getPostgreConfig(conf, id);
    default:
      throw Error(`Unknown database client : ${conf.client}`);
  }
};

const getMysqlConfig = (conf, id) => {
  return {
    client: conf.client,
    debug: conf.debug || false,
    connection: {
      host: conf.host,
      port: conf.port,
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

const getPostgreConfig = (conf, id) => {
  return {
    client: conf.client,
    debug: conf.debug || false,
    connection: conf.connectionString,
    pool: {
      min: conf.poolMin || 2,
      max: conf.poolMax || 10,
    },
    userParams: {
      client: conf.client + id,
    },
  };
};

const getSqlite3Config = (conf, id) => {
  return {
    client: conf.client,
    debug: conf.debug || false,
    connection: {
      filename: conf.name,
      flags: conf.flags ? conf.flags.split(',') : [],
      timezone: 'Z',
    },
    pool: {
      min: 1,
      max: 1,
    },
    userParams: {
      client: conf.client + id,
    },
  };
};

export default () => {
  const autoConf = config.db[config.d];
  return {
    [config.NODE_ENV]: {
      ...generateKnexConfig(autoConf),
      migrations: {
        tableName: '__knex_migrations',
        directory: `./database/migrations/${config.d}/`,
        stub: `./database/migrations/stub`,
      },
      seeds: {
        directory: `./database/seeds/${config.d}/`,
      },
    },
  };
};
