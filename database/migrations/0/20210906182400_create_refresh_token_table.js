export const up = (knex) => {
  return knex.schema.createTable('refresh_token', (t) => {
    t.increments('id').notNullable().unique().primary();
    t.integer('user_id').unsigned().notNullable();
    t.foreign('user_id').references('user.id').onDelete(knex.raw('CASCADE'));
    t.integer('parent_id').unsigned();
    t.foreign('parent_id').references('refresh_token.id').onDelete(knex.raw('CASCADE'));
    t.string('refresh_token').notNullable().unique();
    t.string('ua').notNullable().defaultTo('');
    t.datetime('expires').notNullable();
    t.boolean('valid').notNullable().defaultTo(true);
    t.json('additional_information');
    t.datetime('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
    t.datetime('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      .notNullable();
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('refresh_token');
};
