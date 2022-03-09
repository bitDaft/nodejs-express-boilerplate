import Knex from 'knex';

import config from '#config';
import { generateKnexConfig } from '#knexfile';

const knexMain = {};
const knexTenant = {};

for (let key in config.db) {
  const knexConfig = generateKnexConfig(config.db[key], key);
  knexMain[key] = Knex(knexConfig);
}

// TODO : fix this to implement getting the correct config info for a tenant
const getTenantConfig = async (tenant) => {
  return {};
};

const getMainKnexInstance = (dbKey) => {
  return knexMain[dbKey];
};

const getTenantKnexInstance = async (tenant) => {
  let knexInstance = knexTenant[tenant];
  if (knexInstance === undefined) {
    const tenantConfig = await getTenantConfig(tenant);
    const knexConfig = generateKnexConfig(tenantConfig, 99);
    knexTenant[tenant] = knexInstance = Knex(knexConfig);
  }
  return knexInstance;
};

delete config.db;

export { knexMain, getTenantKnexInstance, getMainKnexInstance };
