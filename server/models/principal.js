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

async function migrateToPrincipals(pool) {
  const hasClients = await tableExists(pool, 'clients');
  const hasPrincipals = await tableExists(pool, 'principals');

  if (hasClients && !hasPrincipals) {
    await pool.query('RENAME TABLE clients TO principals');
  }

  if (!(await tableExists(pool, 'principals'))) {
    await pool.query(`CREATE TABLE IF NOT EXISTS principals (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
      KEY idx_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  }

  const hasApplicantClients = await tableExists(pool, 'applicant_clients');
  const hasApplicantPrincipals = await tableExists(pool, 'applicant_principals');

  if (hasApplicantClients && !hasApplicantPrincipals) {
    await pool.query('RENAME TABLE applicant_clients TO applicant_principals');
  }

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

// The clients→principals migration probes information_schema several times —
// run once per process (memoized promise; reset on failure to allow retry).
let ensureTablePromise = null;

function ensureTable() {
  if (!ensureTablePromise) {
    ensureTablePromise = (async () => {
      const pool = await getPool();
      await migrateToPrincipals(pool);
    })().catch((err) => {
      ensureTablePromise = null;
      throw err;
    });
  }
  return ensureTablePromise;
}

async function getAllPrincipals() {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT * FROM principals ORDER BY name ASC`
  );
  return rows;
}

async function getPrincipalByName(name) {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.execute(
    `SELECT * FROM principals WHERE name = ? LIMIT 1`,
    [name]
  );
  return rows.length > 0 ? rows[0] : null;
}

async function addPrincipal(name) {
  await ensureTable();
  const pool = await getPool();
  try {
    const [result] = await pool.execute(
      `INSERT INTO principals (name) VALUES (?)`,
      [name]
    );
    return { success: true, id: result.insertId, name };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      throw new Error('Principal already exists');
    }
    throw error;
  }
}

async function deletePrincipal(id) {
  await ensureTable();
  const pool = await getPool();
  const [result] = await pool.execute(
    `DELETE FROM principals WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

async function initializeDefaultPrincipals() {
  await ensureTable();
  const pool = await getPool();
  const defaultPrincipals = [
    'DATIAN', 'HOKEI', 'POBC', 'JINBOWAY',
    'SURPRISE', 'THALESTE', 'AOLLY', 'ENJOY',
  ];

  for (const principalName of defaultPrincipals) {
    try {
      await pool.execute(
        `INSERT IGNORE INTO principals (name) VALUES (?)`,
        [principalName]
      );
    } catch (error) {
      console.log(`Principal ${principalName} already exists or error:`, error.message);
    }
  }
}

module.exports = {
  ensureTable,
  getAllPrincipals,
  getPrincipalByName,
  addPrincipal,
  deletePrincipal,
  initializeDefaultPrincipals,
  // Backward-compatible aliases
  getAllClients: getAllPrincipals,
  getClientByName: getPrincipalByName,
  addClient: addPrincipal,
  deleteClient: deletePrincipal,
  initializeDefaultClients: initializeDefaultPrincipals,
};
