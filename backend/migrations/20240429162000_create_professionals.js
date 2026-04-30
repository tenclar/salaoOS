// backend/migrations/20240429162000_create_professionals.js
exports.up = function (knex) {
  return knex.schema.createTable('professionals', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('phone');
    table.string('email').unique();
    table.enu('role', ['recepcao', 'profissional']).notNullable();
    table.string('specialty');
    table.text('working_hours'); // JSON string like [{day:'Mon', start:'09:00', end:'18:00'}]
    table.decimal('commission_rate', 5, 2).defaultTo(0); // percentage
    table.boolean('active').defaultTo(true);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('professionals');
};
