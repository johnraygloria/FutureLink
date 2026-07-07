const { getPool } = require('./client');

async function tableExists(pool, tableName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.TABLES
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
    [tableName]
  );
  return rows[0].count > 0;
}

async function columnExists(pool, tableName, columnName) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = ?
       AND COLUMN_NAME = ?`,
    [tableName, columnName]
  );
  return rows[0].count > 0;
}

async function ensureTable() {
  const pool = await getPool();
  const { ensureTable: ensurePrincipals } = require('./principal');
  await ensurePrincipals();

  if (!(await tableExists(pool, 'applicant_principals'))) {
    await pool.query(`CREATE TABLE IF NOT EXISTS applicant_principals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      applicant_id INT NOT NULL,
      principal_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY unique_applicant_principal (applicant_id, principal_id),
      KEY idx_applicant_id (applicant_id),
      KEY idx_principal_id (principal_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  } else if (await columnExists(pool, 'applicant_principals', 'client_id')) {
    await pool.query(
      'ALTER TABLE applicant_principals CHANGE client_id principal_id INT NOT NULL'
    );
  }
}

async function getApplicantPrincipals(applicantId) {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.execute(
    `SELECT p.id, p.name
     FROM applicant_principals ap
     JOIN principals p ON ap.principal_id = p.id
     WHERE ap.applicant_id = ?
     ORDER BY p.name ASC`,
    [applicantId]
  );
  return rows;
}

async function setApplicantPrincipals(applicantId, principalIds) {
  await ensureTable();
  const pool = await getPool();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute(
      `DELETE FROM applicant_principals WHERE applicant_id = ?`,
      [applicantId]
    );

    if (principalIds && principalIds.length > 0) {
      const values = principalIds.map((principalId) => [applicantId, principalId]);
      await connection.query(
        `INSERT INTO applicant_principals (applicant_id, principal_id) VALUES ?`,
        [values]
      );
    }

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getApplicantPrincipalsByName(applicantNo) {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.execute(
    `SELECT p.name
     FROM applicant_principals ap
     JOIN principals p ON ap.principal_id = p.id
     JOIN recruitment_applicants ra ON ap.applicant_id = ra.id
     WHERE ra.applicant_no = ?
     ORDER BY p.name ASC`,
    [applicantNo]
  );
  return rows.map((row) => row.name);
}

module.exports = {
  ensureTable,
  getApplicantPrincipals,
  setApplicantPrincipals,
  getApplicantPrincipalsByName,
  // Backward-compatible aliases
  getApplicantClients: getApplicantPrincipals,
  setApplicantClients: setApplicantPrincipals,
  getApplicantClientsByName: getApplicantPrincipalsByName,
};
