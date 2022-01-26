export const up = (knex) => {
  return knex.schema.createTable("refresh_token", (t) => {
    t.increments("id").notNullable().unique().primary();
    t.integer("user_id").unsigned().notNullable().unique();
    t.foreign("user_id").references("user.id").onDelete(knex.raw("CASCADE"));
    t.string("refresh_token").notNullable().unique();
    t.datetime("expires").notNullable();
    t.boolean('is_deleted').notNullable().defaultTo(false);
    t.json("additional_information");
    t.datetime("created_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP"))
      .notNullable();
    t.datetime("updated_at")
      .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"))
      .notNullable();
  });
};

export const down = (knex) => {
  return knex.schema.dropTable("refresh_token");
};
