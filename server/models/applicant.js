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

async function ensureTables() {
  const pool = await getPool();
  await pool.query(`CREATE TABLE IF NOT EXISTS recruitment_applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_no VARCHAR(50),
    referred_by VARCHAR(150),
    last_name VARCHAR(100),
    first_name VARCHAR(100),
    ext VARCHAR(50),
    middle_name VARCHAR(100),
    gender VARCHAR(50),
    size VARCHAR(20),
    date_of_birth VARCHAR(50),
    date_applied VARCHAR(50),
    fb_name VARCHAR(150),
    age VARCHAR(10),
    location VARCHAR(150),
    contact_number VARCHAR(50),
    position_applied_for VARCHAR(150),
    experience VARCHAR(255),
    status VARCHAR(100),
    requirements_status VARCHAR(150),
    final_interview_status VARCHAR(150),
    medical_status VARCHAR(150),
    status_remarks VARCHAR(255),
    applicant_remarks VARCHAR(255),
    recent_picture TINYINT(1) DEFAULT 0,
    psa_birth_certificate TINYINT(1) DEFAULT 0,
    school_credentials TINYINT(1) DEFAULT 0,
    nbi_clearance TINYINT(1) DEFAULT 0,
    police_clearance TINYINT(1) DEFAULT 0,
    barangay_clearance TINYINT(1) DEFAULT 0,
    sss TINYINT(1) DEFAULT 0,
    pagibig TINYINT(1) DEFAULT 0,
    cedula TINYINT(1) DEFAULT 0,
    vaccination_status TINYINT(1) DEFAULT 0,
    resume TINYINT(1) DEFAULT 0,
    coe TINYINT(1) DEFAULT 0,
    philhealth TINYINT(1) DEFAULT 0,
    tin_number TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_applicant_no (applicant_no),
    KEY idx_status (status)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  // Screening history table
  await pool.query(`CREATE TABLE IF NOT EXISTS screening_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_no VARCHAR(50),
    action VARCHAR(100),
    status VARCHAR(100),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_applicant_no (applicant_no)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  // Assessment history table
  await pool.query(`CREATE TABLE IF NOT EXISTS assessment_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_no VARCHAR(50),
    action VARCHAR(100),
    status VARCHAR(100),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_assessment_applicant_no (applicant_no)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  // Selection history table
  await pool.query(`CREATE TABLE IF NOT EXISTS selection_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_no VARCHAR(50),
    action VARCHAR(100),
    status VARCHAR(100),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_selection_applicant_no (applicant_no)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
  // Engagement history table
  await pool.query(`CREATE TABLE IF NOT EXISTS engagement_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_no VARCHAR(50),
    action VARCHAR(100),
    status VARCHAR(100),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY idx_engagement_applicant_no (applicant_no)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
}

async function insertRecruitmentApplicant(data) {
  await ensureTables();
  const pool = await getPool();

  const values = [
    data.applicant_no || null,
    data.referred_by || null,
    data.last_name || null,
    data.first_name || null,
    data.ext || null,
    data.middle_name || null,
    data.gender || null,
    data.size || null,
    data.date_of_birth || null,
    data.date_applied || null,
    data.fb_name || null,
    data.age || null,
    data.location || null,
    data.contact_number || null,
    data.position_applied_for || null,
    data.experience || null,
    data.status || null,
    data.requirements_status || null,
    data.final_interview_status || null,
    data.medical_status || null,
    data.status_remarks || null,
    data.applicant_remarks || null,
    data.recent_picture ? 1 : 0,
    data.psa_birth_certificate ? 1 : 0,
    data.school_credentials ? 1 : 0,
    data.nbi_clearance ? 1 : 0,
    data.police_clearance ? 1 : 0,
    data.barangay_clearance ? 1 : 0,
    data.sss ? 1 : 0,
    data.pagibig ? 1 : 0,
    data.cedula ? 1 : 0,
    data.vaccination_status ? 1 : 0,
    data.resume ? 1 : 0,
    data.coe ? 1 : 0,
    data.philhealth ? 1 : 0,
    data.tin_number ? 1 : 0,
  ];

  const placeholders = values.map(() => '?').join(',');

  const [result] = await pool.execute(
    `INSERT INTO recruitment_applicants (
      applicant_no, referred_by, last_name, first_name, ext, middle_name, gender, size, date_of_birth,
      date_applied, fb_name, age, location, contact_number, position_applied_for, experience, status,
      requirements_status, final_interview_status, medical_status, status_remarks, applicant_remarks,
      recent_picture, psa_birth_certificate, school_credentials, nbi_clearance, police_clearance,
      barangay_clearance, sss, pagibig, cedula, vaccination_status, resume, coe, philhealth, tin_number
     ) VALUES (${placeholders})`,
    values
  );
  return result;
}

async function fetchRecruitmentApplicants() {
  await ensureTables();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT * FROM recruitment_applicants ORDER BY created_at DESC`
  );
  
  // Fetch clients for each applicant
  const { getApplicantClientsByName } = require('./applicantClient');
  for (const row of rows) {
    if (row.applicant_no) {
      try {
        const clientNames = await getApplicantClientsByName(row.applicant_no);
        // Add clients array to row for backward compatibility
        row.clients = clientNames;
        // Also add individual fields for backward compatibility (empty if not selected)
        row.datian = clientNames.includes('DATIAN') ? 'Ok' : '';
        row.hokei = clientNames.includes('HOKEI') ? 'Ok' : '';
        row.pobc = clientNames.includes('POBC') ? 'Ok' : '';
        row.jinboway = clientNames.includes('JINBOWAY') ? 'Ok' : '';
        row.surprise = clientNames.includes('SURPRISE') ? 'Ok' : '';
        row.thaleste = clientNames.includes('THALESTE') ? 'Ok' : '';
        row.aolly = clientNames.includes('AOLLY') ? 'Ok' : '';
        row.enjoy = clientNames.includes('ENJOY') ? 'Ok' : '';
      } catch (error) {
        console.error('Error fetching clients for applicant:', error);
      }
    }
  }
  
  return rows;
}

async function upsertRecruitmentApplicant(data) {
  await ensureTables();
  const pool = await getPool();
  const { applicant_no } = data;
  // If applicant_no exists, update; else insert
  const [rows] = await pool.execute(
    `SELECT id FROM recruitment_applicants WHERE applicant_no = ? LIMIT 1`,
    [applicant_no]
  );
  if (Array.isArray(rows) && rows.length > 0) {
    const id = rows[0].id;
    const normalize = (v) => {
      if (v === undefined || v === null || v === '') return null;
      return v;
    };
    const normalizeBit = (v) => {
      if (v === undefined || v === null || v === '') return null;
      return v ? 1 : 0;
    };
    await pool.execute(
      `UPDATE recruitment_applicants
       SET referred_by=IFNULL(?, referred_by), last_name=IFNULL(?, last_name), first_name=IFNULL(?, first_name), ext=IFNULL(?, ext), middle_name=IFNULL(?, middle_name), gender=IFNULL(?, gender), size=IFNULL(?, size), date_of_birth=IFNULL(?, date_of_birth),
           date_applied=IFNULL(?, date_applied), fb_name=IFNULL(?, fb_name), age=IFNULL(?, age), location=IFNULL(?, location), contact_number=IFNULL(?, contact_number), position_applied_for=IFNULL(?, position_applied_for), experience=IFNULL(?, experience),
           status=IFNULL(?, status),
           requirements_status=IFNULL(?, requirements_status), final_interview_status=IFNULL(?, final_interview_status), medical_status=IFNULL(?, medical_status), status_remarks=IFNULL(?, status_remarks), applicant_remarks=IFNULL(?, applicant_remarks),
           recent_picture=IFNULL(?, recent_picture), psa_birth_certificate=IFNULL(?, psa_birth_certificate), school_credentials=IFNULL(?, school_credentials), nbi_clearance=IFNULL(?, nbi_clearance), police_clearance=IFNULL(?, police_clearance),
           barangay_clearance=IFNULL(?, barangay_clearance), sss=IFNULL(?, sss), pagibig=IFNULL(?, pagibig), cedula=IFNULL(?, cedula), vaccination_status=IFNULL(?, vaccination_status), resume=IFNULL(?, resume), coe=IFNULL(?, coe), philhealth=IFNULL(?, philhealth), tin_number=IFNULL(?, tin_number)
       WHERE id = ?`,
      [
        normalize(data.referred_by),
        normalize(data.last_name),
        normalize(data.first_name),
        normalize(data.ext),
        normalize(data.middle_name),
        normalize(data.gender),
        normalize(data.size),
        normalize(data.date_of_birth),
        normalize(data.date_applied),
        normalize(data.fb_name),
        normalize(data.age),
        normalize(data.location),
        normalize(data.contact_number),
        normalize(data.position_applied_for),
        normalize(data.experience),
        normalize(data.status),
        normalize(data.requirements_status),
        normalize(data.final_interview_status),
        normalize(data.medical_status),
        normalize(data.status_remarks),
        normalize(data.applicant_remarks),
        normalizeBit(data.recent_picture),
        normalizeBit(data.psa_birth_certificate),
        normalizeBit(data.school_credentials),
        normalizeBit(data.nbi_clearance),
        normalizeBit(data.police_clearance),
        normalizeBit(data.barangay_clearance),
        normalizeBit(data.sss),
        normalizeBit(data.pagibig),
        normalizeBit(data.cedula),
        normalizeBit(data.vaccination_status),
        normalizeBit(data.resume),
        normalizeBit(data.coe),
        normalizeBit(data.philhealth),
        normalizeBit(data.tin_number),
        id,
      ]
    );
    return { updated: true, id };
  } else {
    const res = await insertRecruitmentApplicant(data);
    return { inserted: true, id: res.insertId };
  }
}

module.exports = {
  getPool,
  ensureTables,
  insertRecruitmentApplicant,
  fetchRecruitmentApplicants,
  upsertRecruitmentApplicant,
};

// Partially update specific fields without overwriting other columns
async function updateApplicantFields(applicant_no, fields) {
  await ensureTables();
  const pool = await getPool();
  const keys = Object.keys(fields);
  if (keys.length === 0) return { affectedRows: 0 };
  const setClause = keys.map(k => `${k} = ?`).join(', ');
  const values = keys.map(k => fields[k]);
  values.push(applicant_no);
  const [res] = await pool.execute(
    `UPDATE recruitment_applicants SET ${setClause} WHERE applicant_no = ?`,
    values
  );
  return res;
}

module.exports.updateApplicantFields = updateApplicantFields;

// Get next unique applicant number
async function getNextApplicantNumber() {
  await ensureTables();
  const pool = await getPool();
  
  // Get all applicant numbers
  const [rows] = await pool.query(
    `SELECT applicant_no FROM recruitment_applicants WHERE applicant_no IS NOT NULL AND applicant_no != ''`
  );
  
  // Find the highest numeric applicant number
  let maxNumber = 0;
  for (const row of rows) {
    const num = parseInt(row.applicant_no, 10);
    if (!isNaN(num) && num > maxNumber) {
      maxNumber = num;
    }
  }
  
  // Return next number (maxNumber + 1)
  return (maxNumber + 1).toString();
}

module.exports.getNextApplicantNumber = getNextApplicantNumber;

// Screening history helpers
async function addScreeningHistory(entry) {
  await ensureTables();
  const pool = await getPool();
  const { applicant_no, action, status, notes } = entry;
  const [res] = await pool.execute(
    `INSERT INTO screening_history (applicant_no, action, status, notes) VALUES (?, ?, ?, ?)`,
    [applicant_no || null, action || null, status || null, notes || null]
  );
  return res;
}

async function fetchScreeningHistory() {
  await ensureTables();
  const pool = await getPool();
  const [rows] = await pool.query(`SELECT * FROM screening_history ORDER BY created_at DESC`);
  return rows;
}

// Enriched screening history with joined applicant fields
async function fetchScreeningHistoryEnriched() {
  await ensureTables();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT sh.*, ra.first_name, ra.last_name, ra.fb_name, ra.position_applied_for, ra.date_applied
     FROM screening_history sh
     LEFT JOIN recruitment_applicants ra
       ON TRIM(ra.applicant_no) = TRIM(sh.applicant_no)
     ORDER BY sh.created_at DESC`
  );
  return rows;
}

module.exports.addScreeningHistory = addScreeningHistory;
module.exports.fetchScreeningHistory = fetchScreeningHistory;
module.exports.fetchScreeningHistoryEnriched = fetchScreeningHistoryEnriched;

// Assessment history helpers
async function addAssessmentHistory(entry) {
  await ensureTables();
  const pool = await getPool();
  const { applicant_no, action, status, notes } = entry;
  const [res] = await pool.execute(
    `INSERT INTO assessment_history (applicant_no, action, status, notes) VALUES (?, ?, ?, ?)`,
    [String(applicant_no || '').trim() || null, action || null, status || null, notes || null]
  );
  return res;
}

async function fetchAssessmentHistoryEnriched() {
  await ensureTables();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT ah.*, ra.first_name, ra.last_name, ra.fb_name, ra.position_applied_for, ra.date_applied
     FROM assessment_history ah
     LEFT JOIN recruitment_applicants ra
       ON TRIM(ra.applicant_no) = TRIM(ah.applicant_no)
     ORDER BY ah.created_at DESC`
  );
  return rows;
}

module.exports.addAssessmentHistory = addAssessmentHistory;
module.exports.fetchAssessmentHistoryEnriched = fetchAssessmentHistoryEnriched;

// Selection history helpers
async function addSelectionHistory(entry) {
  await ensureTables();
  const pool = await getPool();
  const { applicant_no, action, status, notes } = entry;
  const [res] = await pool.execute(
    `INSERT INTO selection_history (applicant_no, action, status, notes) VALUES (?, ?, ?, ?)`,
    [applicant_no || null, action || null, status || null, notes || null]
  );
  return res;
}

async function fetchSelectionHistoryEnriched() {
  await ensureTables();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT sh.*, ra.first_name, ra.last_name, ra.fb_name, ra.position_applied_for, ra.date_applied
     FROM selection_history sh
     LEFT JOIN recruitment_applicants ra
       ON TRIM(ra.applicant_no) = TRIM(sh.applicant_no)
     ORDER BY sh.created_at DESC`
  );
  return rows;
}

module.exports.addSelectionHistory = addSelectionHistory;
module.exports.fetchSelectionHistoryEnriched = fetchSelectionHistoryEnriched;

// Engagement history helpers
async function addEngagementHistory(entry) {
  await ensureTables();
  const pool = await getPool();
  const { applicant_no, action, status, notes } = entry;
  const [res] = await pool.execute(
    `INSERT INTO engagement_history (applicant_no, action, status, notes) VALUES (?, ?, ?, ?)`,
    [applicant_no || null, action || null, status || null, notes || null]
  );
  return res;
}

async function fetchEngagementHistoryEnriched() {
  await ensureTables();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT eh.*, ra.first_name, ra.last_name, ra.fb_name, ra.position_applied_for, ra.date_applied
     FROM engagement_history eh
     LEFT JOIN recruitment_applicants ra
       ON TRIM(ra.applicant_no) = TRIM(eh.applicant_no)
     ORDER BY eh.created_at DESC`
  );
  return rows;
}

module.exports.addEngagementHistory = addEngagementHistory;
module.exports.fetchEngagementHistoryEnriched = fetchEngagementHistoryEnriched;