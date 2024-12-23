import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.text("description").notNullable();
    table.string("date").notNullable();
    table.boolean("isInDiet").notNullable();
    table.uuid("user_id").notNullable().references("id").inTable("users");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
