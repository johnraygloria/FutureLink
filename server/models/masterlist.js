const { getPool } = require('./client');

async function ensureTable() {
  const pool = await getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS masterlist_employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    emp_id VARCHAR(50) NOT NULL,
    last_name VARCHAR(100) DEFAULT NULL,
    first_name VARCHAR(100) DEFAULT NULL,
    ext_name VARCHAR(50) DEFAULT NULL,
    middle_name VARCHAR(100) DEFAULT NULL,
    mobile_number VARCHAR(50) DEFAULT NULL,
    address VARCHAR(255) DEFAULT NULL,
    gender VARCHAR(10) DEFAULT NULL,
    date_hired VARCHAR(50) DEFAULT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    employment_status VARCHAR(20) NOT NULL DEFAULT 'PROBATIONARY',
    remarks VARCHAR(255) DEFAULT NULL,
    position VARCHAR(150) DEFAULT NULL,
    dept_line VARCHAR(100) DEFAULT NULL,
    section VARCHAR(100) DEFAULT NULL,
    building VARCHAR(100) DEFAULT NULL,
    shift VARCHAR(10) DEFAULT NULL,
    applicant_no VARCHAR(50) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY idx_emp_id (emp_id),
    KEY idx_status (status),
    KEY idx_employment_status (employment_status),
    KEY idx_applicant_no (applicant_no)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

function normalizeGender(gender) {
  if (!gender) return null;
  const value = String(gender).trim().toUpperCase();
  if (value.startsWith('M')) return 'M';
  if (value.startsWith('F')) return 'F';
  return value.slice(0, 10);
}

const LEGACY_SEED_IDS = [
  'FL-2024-001',
  'FL-2024-002',
  'FL-2024-003',
  'FL-2024-004',
  'FL-2024-005',
];

async function removeLegacySeedData() {
  await ensureTable();
  const pool = await getPool();
  const placeholders = LEGACY_SEED_IDS.map(() => '?').join(', ');
  await pool.execute(
    `DELETE FROM masterlist_employees WHERE applicant_no IS NULL AND emp_id IN (${placeholders})`,
    LEGACY_SEED_IDS
  );
  await pool.execute(
    `UPDATE masterlist_employees SET status = 'RESIGNED' WHERE status = 'INACTIVE'`
  );
}

async function syncDeployedApplicants() {
  await ensureTable();
  const pool = await getPool();

  const [deployed] = await pool.query(
    `SELECT applicant_no, last_name, first_name, ext, middle_name, gender,
            contact_number, location, date_applied, position_applied_for
     FROM recruitment_applicants
     WHERE status = 'Deployed'`
  );

  for (const applicant of deployed) {
    const empId = `FL-${String(applicant.applicant_no).padStart(4, '0')}`;
    await pool.execute(
      `INSERT INTO masterlist_employees (
        emp_id, applicant_no, last_name, first_name, ext_name, middle_name,
        mobile_number, address, gender, date_hired, status, employment_status,
        position, remarks, shift
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 'PROBATIONARY', ?, '-', 'DAY')
      ON DUPLICATE KEY UPDATE
        applicant_no = VALUES(applicant_no),
        last_name = VALUES(last_name),
        first_name = VALUES(first_name),
        ext_name = VALUES(ext_name),
        middle_name = VALUES(middle_name),
        mobile_number = VALUES(mobile_number),
        address = VALUES(address),
        gender = VALUES(gender),
        date_hired = VALUES(date_hired),
        position = VALUES(position)`,
      [
        empId,
        applicant.applicant_no,
        applicant.last_name,
        applicant.first_name,
        applicant.ext,
        applicant.middle_name,
        applicant.contact_number,
        applicant.location,
        normalizeGender(applicant.gender),
        applicant.date_applied,
        applicant.position_applied_for,
      ]
    );
  }
}

async function initializeMasterlist() {
  await removeLegacySeedData();
  await syncDeployedApplicants();
}

async function getAllEmployees() {
  await initializeMasterlist();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT * FROM masterlist_employees ORDER BY id ASC`
  );
  return rows;
}

async function insertEmployee(data) {
  await ensureTable();
  const pool = await getPool();

  const [result] = await pool.execute(
    `INSERT INTO masterlist_employees (
      emp_id, last_name, first_name, ext_name, middle_name, mobile_number, address,
      gender, date_hired, status, employment_status, remarks, position, dept_line,
      section, building, shift, applicant_no
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.emp_id,
      data.last_name || null,
      data.first_name || null,
      data.ext_name || null,
      data.middle_name || null,
      data.mobile_number || null,
      data.address || null,
      normalizeGender(data.gender),
      data.date_hired || null,
      data.status || 'ACTIVE',
      data.employment_status || 'PROBATIONARY',
      data.remarks || null,
      data.position || null,
      data.dept_line || null,
      data.section || null,
      data.building || null,
      data.shift || 'DAY',
      data.applicant_no || null,
    ]
  );

  const [rows] = await pool.execute(
    `SELECT * FROM masterlist_employees WHERE id = ? LIMIT 1`,
    [result.insertId]
  );
  return rows[0];
}

async function updateEmployeeFields(id, fields) {
  await ensureTable();
  const pool = await getPool();

  const allowed = new Set([
    'status',
    'employment_status',
    'remarks',
    'shift',
    'dept_line',
    'section',
    'building',
    'position',
  ]);

  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && allowed.has(key)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (updates.length === 0) {
    return null;
  }

  values.push(id);
  await pool.execute(
    `UPDATE masterlist_employees SET ${updates.join(', ')} WHERE id = ?`,
    values
  );

  const [rows] = await pool.execute(
    `SELECT * FROM masterlist_employees WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  ensureTable,
  initializeMasterlist,
  getAllEmployees,
  insertEmployee,
  updateEmployeeFields,
};
