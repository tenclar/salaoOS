// backend/migrations/20240429164000_create_products.js
exports.up = function (knex) {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('category');
    table.string('brand');
    table.string('type'); // venda ou consumo interno
    table.decimal('cost_price', 10, 2);
    table.decimal('sale_price', 10, 2);
    table.integer('stock_quantity').defaultTo(0);
    table.integer('min_stock').defaultTo(0);
    table.string('unit');
    table.string('supplier');
    table.date('expiration');
    table.boolean('active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('products');
};
