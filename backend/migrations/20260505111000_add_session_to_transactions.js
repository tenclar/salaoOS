// backend/migrations/20260505111000_add_session_to_transactions.js
exports.up = function (knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.integer('cash_session_id').unsigned().references('id').inTable('cash_sessions').onDelete('SET NULL');
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('transactions', (table) => {
    table.dropColumn('cash_session_id');
  });
};
