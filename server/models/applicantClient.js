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
  await pool.query(`CREATE TABLE IF NOT EXISTS applicant_clients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT NOT NULL,
    client_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_applicant_client (applicant_id, client_id),
    KEY idx_applicant_id (applicant_id),
    KEY idx_client_id (client_id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

async function getApplicantClients(applicantId) {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.execute(
    `SELECT c.id, c.name 
     FROM applicant_clients ac
     JOIN clients c ON ac.client_id = c.id
     WHERE ac.applicant_id = ?
     ORDER BY c.name ASC`,
    [applicantId]
  );
  return rows;
}

async function setApplicantClients(applicantId, clientIds) {
  await ensureTable();
  const pool = await getPool();
  
  // Start transaction
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  
  try {
    // Delete existing client associations
    await connection.execute(
      `DELETE FROM applicant_clients WHERE applicant_id = ?`,
      [applicantId]
    );
    
    // Insert new client associations
    if (clientIds && clientIds.length > 0) {
      const values = clientIds.map(clientId => [applicantId, clientId]);
      await connection.query(
        `INSERT INTO applicant_clients (applicant_id, client_id) VALUES ?`,
        [values]
      );
    }
    
    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getApplicantClientsByName(applicantNo) {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.execute(
    `SELECT c.name 
     FROM applicant_clients ac
     JOIN clients c ON ac.client_id = c.id
     JOIN recruitment_applicants ra ON ac.applicant_id = ra.id
     WHERE ra.applicant_no = ?
     ORDER BY c.name ASC`,
    [applicantNo]
  );
  return rows.map(row => row.name);
}

module.exports = {
  getPool,
  ensureTable,
  getApplicantClients,
  setApplicantClients,
  getApplicantClientsByName,
};