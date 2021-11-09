import Knex from "knex";
import { Model } from "objection";

import config from "#config";
import knex_config from "#knexfile";

const knex = Knex(knex_config[config.NODE_ENV]);
Model.knex(knex);

export { knex, Model };
