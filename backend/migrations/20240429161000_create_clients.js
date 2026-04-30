// backend/migrations/20240429161000_create_clients.js
exports.up = function (knex) {
  return knex.schema.createTable('clients', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('phone');
    table.string('whatsapp');
    table.string('email');
    table.date('birthdate');
    table.string('address');
    table.text('notes');
    table.text('preferences');
    table.text('allergies');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('clients');
};
