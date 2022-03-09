import Knex from 'knex';

import config from '#config';
import { generateKnexConfig } from '#knexfile';

const knexMain = {};
const knexTenant = {};

for (let key in config.db) {
  const knexConfig = generateKnexConfig(config.db[key], key);
  knexMain[key] = Knex(knexConfig);
}

const getMainKnexInstance = (dbKey) => {
  return knexMain[dbKey];
};

const getTenantKnexInstance = (tenant) => {
  let knexInstance = knexTenant[tenant];
  if (knexInstance === undefined) {
    // TODO : fix this to implement getting the correct config for a tenant
    tenantConfig = {};
    let knexConfig = generateKnexConfig(tenantConfig, 99);
    knexTenant[tenant] = knexInstance = Knex(knexConfig);
  }
  return knexInstance;
};

delete config.db;

export { knexMain, getTenantKnexInstance, getMainKnexInstance };
