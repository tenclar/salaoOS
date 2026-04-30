// backend/src/scripts/init_db.js
// Simple script to ensure the MySQL database exists and then run migrations.
// Uses mysql2 to connect without specifying a database, creates the DB if missing,
// then invokes knex migration programmatically.

const mysql = require('mysql2/promise');
const { exec } = require('child_process');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_NAME = process.env.DB_NAME || 'salaobc';

async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({host: DB_HOST, user: DB_USER, password: DB_PASSWORD});
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();
  console.log(`Database '${DB_NAME}' ensured.`);
}

function runMigrations() {
  return new Promise((resolve, reject) => {
    exec('npm run migrate', { cwd: process.cwd() }, (err, stdout, stderr) => {
      if (err) {
        console.error('Migration error:', stderr || err);
        reject(err);
      } else {
        console.log('Migrations output:', stdout);
        resolve();
      }
    });
  });
}

(async () => {
  try {
    await createDatabaseIfNotExists();
    await runMigrations();
    console.log('Database initialization complete.');
  } catch (e) {
    console.error('Error during DB init:', e);
    process.exit(1);
  }
})();
