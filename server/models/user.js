const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('../config');

let pool;

async function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

async function ensureUserTable() {
  const pool = await getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role TINYINT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_role (role)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

async function findUserByEmail(email) {
  await ensureUserTable();
  const pool = await getPool();
  const [rows] = await pool.execute(`SELECT * FROM users WHERE email = ? LIMIT 1`, [email]);
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function createUser({ email, password_hash, full_name, role }) {
  await ensureUserTable();
  const pool = await getPool();
  const [res] = await pool.execute(
    `INSERT INTO users (email, password_hash, full_name, role) VALUES (?, ?, ?, ?)`,
    [email, password_hash, full_name || null, role]
  );
  return { id: res.insertId };
}

module.exports = {
  getPool,
  ensureUserTable,
  findUserByEmail,
  createUser,
};


