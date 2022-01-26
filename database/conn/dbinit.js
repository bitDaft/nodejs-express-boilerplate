import Knex from 'knex';

import config from '#config';
import { generateKnexConfig } from '#knexfile';

const knexI = {};

for (let key in config.db) {
  const knexConfig = generateKnexConfig(config.db[key], key);
  knexI[key] = Knex(knexConfig);
}

delete config.db;

export { knexI };
