// backend/migrations/20260505103000_create_transactions.js
exports.up = function (knex) {
  return knex.schema.createTable('transactions', (table) => {
    table.increments('id').primary();
    table.enu('type', ['receita', 'despesa']).notNullable();
    table.string('category').notNullable();
    table.string('description').notNullable();
    table.decimal('amount', 10, 2).notNullable();
    table.enu('status', ['pendente', 'pago', 'cancelado']).defaultTo('pendente');
    table.date('due_date').notNullable();
    table.date('payment_date');
    table.string('payment_method');
    table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('SET NULL');
    table.integer('professional_id').unsigned().references('id').inTable('professionals').onDelete('SET NULL');
    table.integer('order_id').unsigned().references('id').inTable('orders').onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('transactions');
};
