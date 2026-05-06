// backend/migrations/20260505101000_create_orders.js
exports.up = function (knex) {
  return knex.schema.createTable('orders', (table) => {
    table.increments('id').primary();
    table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('SET NULL');
    table.enu('status', ['aberta', 'fechada', 'cancelada']).defaultTo('aberta');
    table.decimal('total_amount', 10, 2).defaultTo(0);
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('orders');
};
