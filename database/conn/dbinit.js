import Knex from 'knex';

import config from '#config';
import { generateKnexConfig } from '#knexfile';

const knexI = {};

for (let key in config.DB) {
  const knexConfig = generateKnexConfig(config.DB[key]);
  knexI[key] = Knex(knexConfig);
}

delete config.DB;

export { knexI };
