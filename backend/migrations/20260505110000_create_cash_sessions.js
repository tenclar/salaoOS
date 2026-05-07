// backend/migrations/20260505110000_create_cash_sessions.js
exports.up = function (knex) {
  return knex.schema.createTable('cash_sessions', (table) => {
    table.increments('id').primary();
    table.timestamp('opened_at').defaultTo(knex.fn.now());
    table.timestamp('closed_at').nullable();
    table.decimal('initial_amount', 10, 2).defaultTo(0);
    table.decimal('final_amount_expected', 10, 2).defaultTo(0);
    table.decimal('final_amount_actual', 10, 2);
    table.enu('status', ['aberto', 'fechado']).defaultTo('aberto');
    table.text('notes');
    table.integer('user_id'); // If there's auth
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('cash_sessions');
};
