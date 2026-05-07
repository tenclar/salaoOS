/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('order_items', table => {
    table.decimal('commission_rate', 5, 2).defaultTo(0);
    table.decimal('commission_amount', 10, 2).defaultTo(0);
    table.boolean('commission_paid').defaultTo(false);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.alterTable('order_items', table => {
    table.dropColumn('commission_rate');
    table.dropColumn('commission_amount');
    table.dropColumn('commission_paid');
  });
};
