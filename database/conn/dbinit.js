import Knex from 'knex';

import config from '#config';
import { generateKnexConfig } from '#knexfile';
import log from '#logger';

const knexMain = {};
const knexTenant = {};

const knexLog = {
  warn(msg) {
    log.warn(msg);
  },
  error(msg) {
    log.error(msg);
  },
  deprecate(msg) {
    log.warn(msg);
  },
  debug(msg) {
    if (msg.method === 'columnInfo') return;
    const sqlString = msg.bindings.reduce((sql, value) => sql.replace('?', value), msg.sql);
    log.sql(`${msg.method} => ${sqlString}`);
  },
};

for (let key in config.db) {
  const knexConfig = generateKnexConfig(config.db[key], key);
  knexConfig.log = knexLog;
  knexMain[key] = Knex(knexConfig);
}

// ^ this function is used to get the different database connections as defined in the env file
const getKnexDBInstance = (dbId) => {
  return knexMain[dbId];
};

// ^ this function is when connection details of tenants are stored in a db and need to fetch them and make the connection at runtime
const getKnexTenantInstance = async (tenantId, tenantInfo) => {
  let knexInstance = knexTenant[tenantId];
  if (knexInstance === undefined) {
    const knexConfig = generateKnexConfig(tenantInfo, tenantId + '_tenant');
    knexConfig.log = knexLog;
    knexTenant[tenantId] = knexInstance = Knex(knexConfig);
  }
  return knexInstance;
};
const dbKeys = Object.keys(config.db);
delete config.db;

process.on('SIGTERM', () => {
  debug('SIGTERM signal received: closing Database connections');
  for (let key in knexMain) {
    let instance = knexMain[key];
    instance.destroy?.((conn) => {
      log.info('Closed db connection ' + conn.userParams.client);
    });
  }
});

export { dbKeys, getKnexTenantInstance, getKnexDBInstance };
