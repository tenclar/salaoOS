// knexfile.js – Knex configuration for MySQL
require('dotenv').config();

module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'salaobc',
    },
    migrations: {
      directory: './backend/migrations',
    },
    seeds: {
      directory: './backend/seeds',
    },
  },
};
