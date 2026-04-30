// backend/src/config/db.js
require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'salaobc',
    // optional: port, charset
  },
  pool: { min: 0, max: 10 },
});

module.exports = db;
