// backend/migrations/20240429165000_create_appointments.js
exports.up = function (knex) {
  return knex.schema.createTable('appointments', (table) => {
    table.increments('id').primary();
    table.integer('client_id').unsigned().references('id').inTable('clients').onDelete('CASCADE');
    table.integer('professional_id').unsigned().references('id').inTable('professionals').onDelete('SET NULL');
    table.integer('service_id').unsigned().references('id').inTable('services').onDelete('SET NULL');
    table.date('date').notNullable();
    table.time('start_time').notNullable();
    table.time('end_time').notNullable();
    table.integer('duration_minutes').notNullable();
    table.decimal('value', 10, 2).notNullable();
    table.enu('status', ['pendente', 'confirmado', 'atendendo', 'finalizado', 'cancelado', 'faltou', 'reagendado']).defaultTo('pendente');
    table.text('notes');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('appointments');
};
