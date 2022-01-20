import config from "./config/index.js";

export default {
  [config.NODE_ENV]: {
    client: config.DB_client,
    debug: config.DB_debug,
    connection: {
      host: config.DB_host,
      user: config.DB_user,
      password: config.DB_pass,
      database: config.DB_db,
      timezone: "Z",
    },
    pool: {
      min: config.DB_pool_min,
      max: config.DB_pool_max,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./database/migrations",
      stub: "./database/migrations/stub",
    },
    seeds: {
      directory: "./database/seeds",
    },
  },
};
