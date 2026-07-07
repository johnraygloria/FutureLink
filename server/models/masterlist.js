const { getPool } = require('./client');

const COLUMN_DEFINITIONS = [
  ['fli_number', 'VARCHAR(50) NOT NULL'],
  ['jbw_job_no', 'VARCHAR(50) DEFAULT NULL'],
  ['last_name', 'VARCHAR(100) DEFAULT NULL'],
  ['first_name', 'VARCHAR(100) DEFAULT NULL'],
  ['ext_name', 'VARCHAR(50) DEFAULT NULL'],
  ['middle_name', 'VARCHAR(100) DEFAULT NULL'],
  ['full_name', 'VARCHAR(255) DEFAULT NULL'],
  ['principal', 'VARCHAR(100) DEFAULT NULL'],
  ['mobile_number', 'VARCHAR(50) DEFAULT NULL'],
  ['fb_link', 'VARCHAR(255) DEFAULT NULL'],
  ['sbma_id_validity', 'VARCHAR(50) DEFAULT NULL'],
  ['email_address', 'VARCHAR(255) DEFAULT NULL'],
  ['gender', 'VARCHAR(10) DEFAULT NULL'],
  ['date_hired', 'VARCHAR(50) DEFAULT NULL'],
  ['status', "VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'"],
  ['remarks', 'VARCHAR(255) DEFAULT NULL'],
  ['position', 'VARCHAR(150) DEFAULT NULL'],
  ['shirt', 'VARCHAR(20) DEFAULT NULL'],
  ['shoes', 'VARCHAR(20) DEFAULT NULL'],
  ['level', 'VARCHAR(50) DEFAULT NULL'],
  ['level_remarks', 'VARCHAR(255) DEFAULT NULL'],
  ['record_date', 'VARCHAR(50) DEFAULT NULL'],
  ['age', 'VARCHAR(10) DEFAULT NULL'],
  ['place', 'VARCHAR(150) DEFAULT NULL'],
  ['sss', 'VARCHAR(50) DEFAULT NULL'],
  ['pagibig', 'VARCHAR(50) DEFAULT NULL'],
  ['philhealth', 'VARCHAR(50) DEFAULT NULL'],
  ['tin', 'VARCHAR(50) DEFAULT NULL'],
  ['house_no', 'VARCHAR(50) DEFAULT NULL'],
  ['street', 'VARCHAR(150) DEFAULT NULL'],
  ['barangay', 'VARCHAR(100) DEFAULT NULL'],
  ['municipality', 'VARCHAR(100) DEFAULT NULL'],
  ['province', 'VARCHAR(100) DEFAULT NULL'],
  ['zip_code', 'VARCHAR(20) DEFAULT NULL'],
  ['complete_present', 'VARCHAR(255) DEFAULT NULL'],
  ['house_no_2', 'VARCHAR(50) DEFAULT NULL'],
  ['street_2', 'VARCHAR(150) DEFAULT NULL'],
  ['barangay_2', 'VARCHAR(100) DEFAULT NULL'],
  ['municipality_2', 'VARCHAR(100) DEFAULT NULL'],
  ['province_2', 'VARCHAR(100) DEFAULT NULL'],
  ['zip_code_2', 'VARCHAR(20) DEFAULT NULL'],
  ['mothers_maiden_name', 'VARCHAR(150) DEFAULT NULL'],
  ['fathers_name', 'VARCHAR(150) DEFAULT NULL'],
  ['civil_status', 'VARCHAR(50) DEFAULT NULL'],
  ['spouses_name', 'VARCHAR(150) DEFAULT NULL'],
  ['num_children', 'VARCHAR(10) DEFAULT NULL'],
  ['children_ages', 'VARCHAR(100) DEFAULT NULL'],
  ['religion', 'VARCHAR(100) DEFAULT NULL'],
  ['contact_person', 'VARCHAR(150) DEFAULT NULL'],
  ['contact_number', 'VARCHAR(50) DEFAULT NULL'],
  ['complete_address', 'VARCHAR(255) DEFAULT NULL'],
  ['relation', 'VARCHAR(100) DEFAULT NULL'],
  ['last_date_present', 'VARCHAR(50) DEFAULT NULL'],
  ['other_remarks', 'VARCHAR(255) DEFAULT NULL'],
  ['transfer_status', 'VARCHAR(100) DEFAULT NULL'],
  ['applicant_no', 'VARCHAR(50) DEFAULT NULL'],
  ['created_at', 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'],
  ['updated_at', 'TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP'],
];

const INSERTABLE_FIELDS = COLUMN_DEFINITIONS
  .map(([name]) => name)
  .filter((name) => !['fli_number', 'created_at', 'updated_at'].includes(name));

const PATCHABLE_FIELDS = new Set([
  'last_name',
  'first_name',
  'middle_name',
  'ext_name',
  'gender',
  'date_hired',
  'status',
  'remarks',
  'other_remarks',
  'transfer_status',
  'position',
  'principal',
  'level',
  'level_remarks',
  'jbw_job_no',
  'mobile_number',
  'fb_link',
  'sbma_id_validity',
  'email_address',
  'shirt',
  'shoes',
  'record_date',
  'age',
  'place',
  'sss',
  'pagibig',
  'philhealth',
  'tin',
  'house_no',
  'street',
  'barangay',
  'municipality',
  'province',
  'zip_code',
  'complete_present',
  'house_no_2',
  'street_2',
  'barangay_2',
  'municipality_2',
  'province_2',
  'zip_code_2',
  'mothers_maiden_name',
  'fathers_name',
  'civil_status',
  'spouses_name',
  'num_children',
  'children_ages',
  'religion',
  'contact_person',
  'contact_number',
  'complete_address',
  'relation',
  'last_date_present',
]);

function formatFliNumber(id) {
  return `FLI-P${String(id).padStart(5, '0')}`;
}

function normalizeGender(gender) {
  if (!gender) return null;
  const value = String(gender).trim().toUpperCase();
  if (value.startsWith('M')) return 'M';
  if (value.startsWith('F')) return 'F';
  return value.slice(0, 10);
}

function buildFullName(data) {
  const last = (data.last_name || '').trim();
  const first = (data.first_name || '').trim();
  const ext = (data.ext_name || '').trim();

  if (!last && !first) return null;

  let name = last && first ? `${last}, ${first}` : (last || first);
  if (ext) name += ` ${ext}`;
  return name.trim();
}

function buildPresentAddress(data) {
  const parts = [
    data.house_no,
    data.street,
    data.barangay,
    data.municipality,
    data.province,
    data.zip_code,
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

function normalizeEmployeePayload(data = {}) {
  const payload = {
    jbw_job_no: data.jbw_job_no ?? data.jbwJobNo ?? null,
    last_name: data.last_name ?? data.lastName ?? null,
    first_name: data.first_name ?? data.firstName ?? null,
    ext_name: data.ext_name ?? data.extName ?? null,
    middle_name: data.middle_name ?? data.middleName ?? null,
    principal: data.principal ?? null,
    mobile_number: data.mobile_number ?? data.mobileNumber ?? null,
    fb_link: data.fb_link ?? data.fbLink ?? null,
    sbma_id_validity: data.sbma_id_validity ?? data.sbmaIdValidity ?? null,
    email_address: data.email_address ?? data.emailAddress ?? data.email ?? null,
    gender: normalizeGender(data.gender),
    date_hired: data.date_hired ?? data.dateHired ?? null,
    status: data.status || 'ACTIVE',
    remarks: data.remarks ?? null,
    position: data.position ?? null,
    shirt: data.shirt ?? null,
    shoes: data.shoes ?? null,
    level: data.level ?? null,
    level_remarks: data.level_remarks ?? data.levelRemarks ?? null,
    record_date: data.record_date ?? data.recordDate ?? data.date ?? null,
    age: data.age != null ? String(data.age) : null,
    place: data.place ?? data.location ?? data.address ?? null,
    sss: data.sss ?? null,
    pagibig: data.pagibig ?? null,
    philhealth: data.philhealth ?? null,
    tin: data.tin ?? null,
    house_no: data.house_no ?? data.houseNo ?? null,
    street: data.street ?? null,
    barangay: data.barangay ?? null,
    municipality: data.municipality ?? null,
    province: data.province ?? null,
    zip_code: data.zip_code ?? data.zipCode ?? null,
    complete_present: data.complete_present ?? data.completePresent ?? null,
    house_no_2: data.house_no_2 ?? data.houseNo2 ?? null,
    street_2: data.street_2 ?? data.street2 ?? null,
    barangay_2: data.barangay_2 ?? data.barangay2 ?? null,
    municipality_2: data.municipality_2 ?? data.municipality2 ?? null,
    province_2: data.province_2 ?? data.province2 ?? null,
    zip_code_2: data.zip_code_2 ?? data.zipCode2 ?? null,
    mothers_maiden_name: data.mothers_maiden_name ?? data.mothersMaidenName ?? null,
    fathers_name: data.fathers_name ?? data.fathersName ?? null,
    civil_status: data.civil_status ?? data.civilStatus ?? null,
    spouses_name: data.spouses_name ?? data.spousesName ?? null,
    num_children: data.num_children ?? data.numChildren ?? null,
    children_ages: data.children_ages ?? data.childrenAges ?? null,
    religion: data.religion ?? null,
    contact_person: data.contact_person ?? data.contactPerson ?? null,
    contact_number: data.contact_number ?? data.contactNumber ?? null,
    complete_address: data.complete_address ?? data.completeAddress ?? null,
    relation: data.relation ?? null,
    last_date_present: data.last_date_present ?? data.lastDatePresent ?? null,
    other_remarks: data.other_remarks ?? data.otherRemarks ?? null,
    transfer_status: data.transfer_status ?? data.transferStatus ?? null,
    applicant_no: data.applicant_no ?? data.applicantNo ?? null,
  };

  payload.full_name = buildFullName(payload);
  if (!payload.complete_present) {
    payload.complete_present = buildPresentAddress(payload);
  }

  return payload;
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

async function migrateTable(pool) {
  const tableExists = await columnExists(pool, 'masterlist_employees', 'id');
  if (!tableExists) {
    const columnSql = [
      'id INT AUTO_INCREMENT PRIMARY KEY',
      ...COLUMN_DEFINITIONS.map(([name, definition]) => `${name} ${definition}`),
    ].join(',\n    ');

    await pool.query(`CREATE TABLE masterlist_employees (
      ${columnSql},
      UNIQUE KEY idx_fli_number (fli_number),
      KEY idx_status (status),
      KEY idx_applicant_no (applicant_no),
      KEY idx_principal (principal)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`);
    return;
  }

  if (await columnExists(pool, 'masterlist_employees', 'emp_id')) {
    if (!(await columnExists(pool, 'masterlist_employees', 'fli_number'))) {
      await pool.query(
        `ALTER TABLE masterlist_employees CHANGE emp_id fli_number VARCHAR(50) NOT NULL`
      );
    }
  }

  for (const [name, definition] of COLUMN_DEFINITIONS) {
    if (name === 'fli_number') continue;
    if (!(await columnExists(pool, 'masterlist_employees', name))) {
      try {
        await pool.query(`ALTER TABLE masterlist_employees ADD COLUMN ${name} ${definition}`);
      } catch (error) {
        if (error.code !== 'ER_DUP_FIELDNAME') throw error;
      }
    }
  }

  const [rows] = await pool.query(
    `SELECT id, fli_number FROM masterlist_employees WHERE fli_number IS NULL OR fli_number = '' OR fli_number LIKE 'FL-%' OR fli_number = 'PENDING'`
  );
  for (const row of rows) {
    await pool.execute(
      `UPDATE masterlist_employees SET fli_number = ? WHERE id = ?`,
      [formatFliNumber(row.id), row.id]
    );
  }

  await pool.execute(
    `UPDATE masterlist_employees SET status = 'RESIGNED' WHERE status = 'INACTIVE'`
  );

  const [nameRows] = await pool.query(
    `SELECT id, last_name, first_name, ext_name, middle_name, full_name
     FROM masterlist_employees
     WHERE full_name IS NULL OR full_name = ''
        OR (middle_name IS NOT NULL AND middle_name != '' AND full_name LIKE CONCAT('%', middle_name, '%'))`
  );
  for (const row of nameRows) {
    const fullName = buildFullName(row);
    await pool.execute(
      `UPDATE masterlist_employees SET full_name = ? WHERE id = ?`,
      [fullName, row.id]
    );
  }

  if (await columnExists(pool, 'masterlist_employees', 'address')) {
    await pool.execute(
      `UPDATE masterlist_employees
       SET place = COALESCE(NULLIF(place, ''), address)
       WHERE address IS NOT NULL AND address != ''`
    );
  }

  if (await columnExists(pool, 'masterlist_employees', 'client')) {
    if (!(await columnExists(pool, 'masterlist_employees', 'principal'))) {
      await pool.query(
        `ALTER TABLE masterlist_employees CHANGE client principal VARCHAR(100) DEFAULT NULL`
      );
    } else {
      await pool.execute(
        `UPDATE masterlist_employees
         SET principal = COALESCE(NULLIF(principal, ''), client)
         WHERE client IS NOT NULL AND client != ''`
      );
    }
  }

  await backfillPrincipalFromApplicants(pool);
}

async function backfillPrincipalFromApplicants(pool) {
  const { ensureTable: ensureApplicantPrincipals } = require('./applicantPrincipal');
  await ensureApplicantPrincipals();

  await pool.execute(
    `UPDATE masterlist_employees me
     INNER JOIN recruitment_applicants ra ON ra.applicant_no = me.applicant_no
     INNER JOIN (
       SELECT ap.applicant_id,
              GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR ', ') AS principal_names
       FROM applicant_principals ap
       INNER JOIN principals p ON p.id = ap.principal_id
       GROUP BY ap.applicant_id
     ) pr ON pr.applicant_id = ra.id
     SET me.principal = pr.principal_names
     WHERE (me.principal IS NULL OR me.principal = '')
       AND pr.principal_names IS NOT NULL
       AND pr.principal_names != ''`
  );
}

async function ensureTable() {
  const pool = await getPool();
  await migrateTable(pool);
}

async function removeLegacySeedData() {
  await ensureTable();
  const pool = await getPool();
  const legacyIds = ['FL-2024-001', 'FL-2024-002', 'FL-2024-003', 'FL-2024-004', 'FL-2024-005'];
  const placeholders = legacyIds.map(() => '?').join(', ');
  await pool.execute(
    `DELETE FROM masterlist_employees WHERE applicant_no IS NULL AND fli_number IN (${placeholders})`,
    legacyIds
  );
}

async function syncDeployedApplicants() {
  await ensureTable();
  const { ensureTable: ensureApplicantPrincipals } = require('./applicantPrincipal');
  await ensureApplicantPrincipals();
  const pool = await getPool();

  const [deployed] = await pool.query(
    `SELECT ra.id, ra.applicant_no, ra.last_name, ra.first_name, ra.ext, ra.middle_name, ra.gender,
            ra.contact_number, ra.location, ra.date_applied, ra.position_applied_for, ra.email, ra.fb_name,
            (
              SELECT GROUP_CONCAT(DISTINCT p.name ORDER BY p.name SEPARATOR ', ')
              FROM applicant_principals ap
              JOIN principals p ON p.id = ap.principal_id
              WHERE ap.applicant_id = ra.id
            ) AS principal_names
     FROM recruitment_applicants ra
     WHERE ra.status = 'Deployed'`
  );

  for (const applicant of deployed) {
    const [existing] = await pool.execute(
      `SELECT id FROM masterlist_employees WHERE applicant_no = ? LIMIT 1`,
      [applicant.applicant_no]
    );

    const payload = normalizeEmployeePayload({
      last_name: applicant.last_name,
      first_name: applicant.first_name,
      ext_name: applicant.ext,
      middle_name: applicant.middle_name,
      principal: applicant.principal_names,
      mobile_number: applicant.contact_number,
      place: applicant.location,
      date_hired: applicant.date_applied,
      position: applicant.position_applied_for,
      email_address: applicant.email,
      fb_link: applicant.fb_name,
      gender: applicant.gender,
      applicant_no: applicant.applicant_no,
      status: 'ACTIVE',
    });

    if (existing.length > 0) {
      const updates = [];
      const values = [];
      for (const [key, value] of Object.entries(payload)) {
        if (value !== null && value !== undefined && value !== '') {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }
      if (updates.length > 0) {
        values.push(existing[0].id);
        await pool.execute(
          `UPDATE masterlist_employees SET ${updates.join(', ')} WHERE id = ?`,
          values
        );
      }
      continue;
    }

    const [result] = await pool.execute(
      `INSERT INTO masterlist_employees (
        fli_number, jbw_job_no, last_name, first_name, ext_name, middle_name, full_name,
        principal, mobile_number, fb_link, sbma_id_validity, email_address, gender,
        date_hired, status, remarks, position, shirt, shoes, level, level_remarks,
        record_date, age, place, sss, pagibig, philhealth, tin, house_no, street,
        barangay, municipality, province, zip_code, complete_present, house_no_2,
        street_2, barangay_2, municipality_2, province_2, zip_code_2,
        mothers_maiden_name, fathers_name, civil_status, spouses_name, num_children,
        children_ages, religion, contact_person, contact_number, complete_address,
        relation, last_date_present, other_remarks, transfer_status, applicant_no
      ) VALUES (${Array(56).fill('?').join(', ')})`,
      [
        'PENDING',
        ...INSERTABLE_FIELDS.map((field) => payload[field] ?? null),
      ]
    );

    const fliNumber = formatFliNumber(result.insertId);
    await pool.execute(
      `UPDATE masterlist_employees SET fli_number = ? WHERE id = ?`,
      [fliNumber, result.insertId]
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

async function getNextFliNumber() {
  await ensureTable();
  const pool = await getPool();
  const [rows] = await pool.query(
    `SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM masterlist_employees`
  );
  return formatFliNumber(rows[0].next_id);
}

async function insertEmployee(data) {
  await ensureTable();
  const pool = await getPool();
  const payload = normalizeEmployeePayload(data);

  const [result] = await pool.execute(
    `INSERT INTO masterlist_employees (
      fli_number, jbw_job_no, last_name, first_name, ext_name, middle_name, full_name,
      principal, mobile_number, fb_link, sbma_id_validity, email_address, gender,
      date_hired, status, remarks, position, shirt, shoes, level, level_remarks,
      record_date, age, place, sss, pagibig, philhealth, tin, house_no, street,
      barangay, municipality, province, zip_code, complete_present, house_no_2,
      street_2, barangay_2, municipality_2, province_2, zip_code_2,
      mothers_maiden_name, fathers_name, civil_status, spouses_name, num_children,
      children_ages, religion, contact_person, contact_number, complete_address,
      relation, last_date_present, other_remarks, transfer_status, applicant_no
    ) VALUES (${Array(56).fill('?').join(', ')})`,
    [
      'PENDING',
      ...INSERTABLE_FIELDS.map((field) => payload[field] ?? null),
    ]
  );

  const fliNumber = formatFliNumber(result.insertId);
  await pool.execute(
    `UPDATE masterlist_employees SET fli_number = ? WHERE id = ?`,
    [fliNumber, result.insertId]
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

  const fieldAliases = {
    lastName: 'last_name',
    firstName: 'first_name',
    middleName: 'middle_name',
    extName: 'ext_name',
    jbwJobNo: 'jbw_job_no',
    mobileNumber: 'mobile_number',
    fbLink: 'fb_link',
    sbmaIdValidity: 'sbma_id_validity',
    emailAddress: 'email_address',
    dateHired: 'date_hired',
    levelRemarks: 'level_remarks',
    recordDate: 'record_date',
    houseNo: 'house_no',
    zipCode: 'zip_code',
    completePresent: 'complete_present',
    houseNo2: 'house_no_2',
    street2: 'street_2',
    barangay2: 'barangay_2',
    municipality2: 'municipality_2',
    province2: 'province_2',
    zipCode2: 'zip_code_2',
    mothersMaidenName: 'mothers_maiden_name',
    fathersName: 'fathers_name',
    civilStatus: 'civil_status',
    spousesName: 'spouses_name',
    numChildren: 'num_children',
    childrenAges: 'children_ages',
    contactPerson: 'contact_person',
    contactNumber: 'contact_number',
    completeAddress: 'complete_address',
    lastDatePresent: 'last_date_present',
    otherRemarks: 'other_remarks',
    transferStatus: 'transfer_status',
  };

  const providedKeys = new Set(
    Object.keys(fields).map((key) => fieldAliases[key] || key)
  );

  const normalized = normalizeEmployeePayload(fields);
  const updates = [];
  const values = [];

  for (const [key, value] of Object.entries(normalized)) {
    if (providedKeys.has(key) && PATCHABLE_FIELDS.has(key)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }
  }

  if (providedKeys.has('status') && fields.status !== undefined && ['ACTIVE', 'RESIGNED', 'TERMINATED'].includes(fields.status)) {
    if (!updates.some((entry) => entry.startsWith('status ='))) {
      updates.push('status = ?');
      values.push(fields.status);
    }
  }

  if (updates.length === 0) {
    return null;
  }

  const nameKeys = ['last_name', 'first_name', 'ext_name'];
  if (nameKeys.some((key) => providedKeys.has(key))) {
    const [current] = await pool.execute(
      `SELECT last_name, first_name, ext_name FROM masterlist_employees WHERE id = ? LIMIT 1`,
      [id]
    );
    if (current.length > 0) {
      const merged = {
        last_name: providedKeys.has('last_name') ? normalized.last_name : current[0].last_name,
        first_name: providedKeys.has('first_name') ? normalized.first_name : current[0].first_name,
        ext_name: providedKeys.has('ext_name') ? normalized.ext_name : current[0].ext_name,
      };
      updates.push('full_name = ?');
      values.push(buildFullName(merged));
    }
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

async function deleteEmployee(id) {
  await ensureTable();
  const pool = await getPool();
  const [result] = await pool.execute(
    `DELETE FROM masterlist_employees WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  ensureTable,
  initializeMasterlist,
  getAllEmployees,
  getNextFliNumber,
  insertEmployee,
  updateEmployeeFields,
  deleteEmployee,
  formatFliNumber,
};
