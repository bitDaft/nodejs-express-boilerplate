export const up = (knex) => {
  return Promise.all([
    knex.raw("SET GLOBAL time_zone='+00:00'"),
    knex.raw("SET time_zone='+00:00'"),
  ]);
};

export const down = (knex) => {
  return Promise.all([
    knex.raw("SET GLOBAL time_zone='SYSTEM'"),
    knex.raw("SET time_zone='SYSTEM'"),
  ]);
};
