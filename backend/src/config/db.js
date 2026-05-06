// backend/src/config/db.js
require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // optional: port, charset
  },
  pool: { min: 0, max: 10 },
});

module.exports = db;
