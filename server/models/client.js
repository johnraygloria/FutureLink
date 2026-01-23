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

async function ensureTable() {
  const pool = await getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_name (name)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

async function getAllClients() {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT * FROM clients ORDER BY name ASC`
  );
  return rows;
}

async function getClientByName(name) {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.execute(
    `SELECT * FROM clients WHERE name = ? LIMIT 1`,
    [name]
  );
  return rows.length > 0 ? rows[0] : null;
}

async function addClient(name) {
  await ensureTable();
  const pool = await getPool();
  try {
    const [result] = await pool.execute(
      `INSERT INTO clients (name) VALUES (?)`,
      [name]
    );
    return { success: true, id: result.insertId, name };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Client already exists');
    }
    throw error;
  }
}

async function deleteClient(id) {
  await ensureTable();
  const pool = await getPool();
  const [result] = await pool.execute(
    `DELETE FROM clients WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

async function initializeDefaultClients() {
  await ensureTable();
  const pool = await getPool();
  const defaultClients = [
    'DATIAN', 'HOKEI', 'POBC', 'JINBOWAY',
    'SURPRISE', 'THALESTE', 'AOLLY', 'ENJOY'
  ];

  for (const clientName of defaultClients) {
    try {
      await pool.execute(
        `INSERT IGNORE INTO clients (name) VALUES (?)`,
        [clientName]
      );
    } catch (error) {
      // Ignore duplicate errors
      console.log(`Client ${clientName} already exists or error:`, error.message);
    }
  }
}

module.exports = {
  getPool,
  ensureTable,
  getAllClients,
  getClientByName,
  addClient,
  deleteClient,
  initializeDefaultClients,
};