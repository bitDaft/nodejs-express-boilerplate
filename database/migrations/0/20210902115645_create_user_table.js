export const up = (knex) => {
  return knex.schema.createTable('user', (t) => {
    t.increments('id').notNullable().unique().primary();
    t.string('name').notNullable();
    t.string('email').notNullable();
    t.string('password').notNullable();
    t.integer('role_id').unsigned().defaultTo(3);
    t.foreign('role_id').references('role.id').onDelete(knex.raw('SET NULL'));
    t.string('verification_token');
    t.datetime('verification_on');
    t.datetime('verification_expiry');
    t.string('reset_token');
    t.datetime('reset_token_expiry');
    t.string('salt').notNullable();
    t.boolean('valid').notNullable().defaultTo(false);
    t.json('additional_information');
    t.datetime('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
    t.datetime('updated_at')
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
      .notNullable();
  });
};

export const down = (knex) => {
  return knex.schema.dropTable('user');
};
