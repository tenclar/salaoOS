// backend/migrations/20240429163000_create_services.js
exports.up = function (knex) {
  return knex.schema.createTable('services', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('category');
    table.text('description');
    table.decimal('price', 10, 2).notNullable();
    table.integer('duration_minutes').notNullable(); // duração em minutos
    table.decimal('commission_rate', 5, 2).defaultTo(0); // percentual da comissão
    table.boolean('active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('services');
};
