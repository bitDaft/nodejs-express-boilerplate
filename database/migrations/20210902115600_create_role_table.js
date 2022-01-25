export const up = (knex) => {
  return knex.schema.createTable('role', (t) => {
    t.increments('id').notNullable().unique().primary();
    t.string('name').notNullable().unique();
    t.boolean('is_deleted').notNullable().defaultTo(false);
    t.json('additional_information');
    t.datetime('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
    t.datetime('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      .notNullable();
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('role');
};
