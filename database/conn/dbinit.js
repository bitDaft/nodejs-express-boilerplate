import Knex from 'knex';

import log from '#logger';
import config from '#config';
import { generateKnexConfig } from '#knexfile';

const knexMain = new Map();
const knexTenant = new Map();

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
  knexMain.set(key, Knex(knexConfig));
}

// ^ this function is used to get the different database connections as defined in the env file
const getKnexDBInstance = (dbId) => {
  return knexMain.get(dbId);
};

// ^ this function is when connection details of tenants are stored in a db and need to fetch them and make the connection at runtime
const getKnexTenantInstance = async (tenantId, tenantInfo) => {
  let knexInstance = knexTenant.get(tenantId);
  if (knexInstance === undefined) {
    const knexConfig = generateKnexConfig(tenantInfo, tenantId + '_tenant');
    knexConfig.log = knexLog;
    knexInstance = Knex(knexConfig);
    knexTenant.set(tenantId, knexInstance);
  }
  return knexInstance;
};
const dbKeys = Object.keys(config.db);
delete config.db;

export { dbKeys, getKnexTenantInstance, getKnexDBInstance, knexMain, knexTenant };
