// backend/migrations/20260505102000_create_order_items.js
exports.up = function (knex) {
  return knex.schema.createTable('order_items', (table) => {
    table.increments('id').primary();
    table.integer('order_id').unsigned().notNullable().references('id').inTable('orders').onDelete('CASCADE');
    table.enu('item_type', ['servico', 'produto']).notNullable();
    table.integer('service_id').unsigned().references('id').inTable('services').onDelete('SET NULL');
    table.integer('product_id').unsigned().references('id').inTable('products').onDelete('SET NULL');
    table.integer('professional_id').unsigned().references('id').inTable('professionals').onDelete('SET NULL');
    table.integer('quantity').notNullable().defaultTo(1);
    table.decimal('unit_price', 10, 2).notNullable();
    table.decimal('total_price', 10, 2).notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('order_items');
};
