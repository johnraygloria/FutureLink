const { insertRecruitmentApplicant, fetchRecruitmentApplicants, fetchApplicantNumbers, upsertRecruitmentApplicant, updateApplicantFields, addScreeningHistory, fetchScreeningHistory, fetchScreeningHistoryEnriched, addAssessmentHistory, addAssessmentHistoryBulk, fetchAssessmentHistoryEnriched, addSelectionHistory, fetchSelectionHistoryEnriched, addEngagementHistory, fetchEngagementHistoryEnriched, getNextApplicantNumber } = require('../models/applicant');
const { setApplicantPrincipals, setApplicantPrincipalsBulk } = require('../models/applicantPrincipal');
const { getAllPrincipals } = require('../models/principal');

exports.createApplicant = (req, res) => {
  res.status(201).json({ message: 'Applicant created', data: req.body });
};


exports.getApplicants = async (req, res) => {
  try {
    const { NO } = req.query;
    const applicants = await fetchRecruitmentApplicants(
      NO ? { applicantNo: String(NO) } : {}
    );
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
};

// Lightweight: applicant numbers only (used by the import preview).
exports.getApplicantNumbers = async (_req, res) => {
  try {
    const numbers = await fetchApplicantNumbers();
    res.json(numbers);
  } catch (error) {
    console.error('getApplicantNumbers error:', error);
    res.status(500).json({ error: 'Failed to fetch applicant numbers' });
  }
};

const toBit = (v) => (v === 1 || v === '1' || v === true) ? 1 : 0;
// Return undefined when value is not provided, so the model layer can pass NULL
// and preserve existing DB values via IFNULL(...) during UPDATE
const toBitOrUndefined = (v) => (v === undefined ? undefined : toBit(v));

// Shared UPPER_CASE / snake_case body → model-shape mapping, used by both the
// single-row upsert and the bulk import so the two can't drift apart.
const mapBodyToApplicant = (body) => ({
  applicant_no: body.NO || body.applicant_no,
  referred_by: body.REFFERED_BY || body.referred_by,
  last_name: body.LAST_NAME || body.last_name,
  first_name: body.FIRST_NAME || body.first_name,
  ext: body.EXT || body.ext,
  middle_name: body.MIDDLE || body.middle_name,
  gender: body.GENDER || body.gender,
  size: body.SIZE || body.size,
  date_of_birth: body.DATE_OF_BIRTH || body.date_of_birth,
  date_applied: body.DATE_APPLIED || body.date_applied,
  fb_name: body.FB_NAME || body.fb_name,
  age: body.AGE || body.age,
  location: body.LOCATION || body.location,
  contact_number: body.CONTACT_NUMBER || body.contact_number,
  email: body.EMAIL || body.email,
  position_applied_for: body.POSITION_APPLIED_FOR || body.position_applied_for,
  experience: body.EXPERIENCE || body.experience,
  status: body.STATUS || body.status,
  requirements_status: body.REQUIREMENTS_STATUS || body.requirements_status,
  final_interview_status: body.FINAL_INTERVIEW_STATUS || body.final_interview_status,
  medical_status: body.MEDICAL_STATUS || body.medical_status,
  physical_screening_status: body.PHYSICAL_SCREENING_STATUS || body.physical_screening_status,
  status_remarks: body.STATUS_REMARKS || body.status_remarks,
  applicant_remarks: body.APPLICANT_REMARKS || body.applicant_remarks,
  recent_picture: toBitOrUndefined(body.RECENT_PICTURE ?? body.recentPicture ?? body.recent_picture),
  psa_birth_certificate: toBitOrUndefined(body.PSA_BIRTH_CERTIFICATE ?? body.psaBirthCertificate ?? body.psa_birth_certificate),
  school_credentials: toBitOrUndefined(body.SCHOOL_CREDENTIALS ?? body.schoolCredentials ?? body.school_credentials),
  nbi_clearance: toBitOrUndefined(body.NBI_CLEARANCE ?? body.nbiClearance ?? body.nbi_clearance),
  police_clearance: toBitOrUndefined(body.POLICE_CLEARANCE ?? body.policeClearance ?? body.police_clearance),
  barangay_clearance: toBitOrUndefined(body.BARANGAY_CLEARANCE ?? body.barangayClearance ?? body.barangay_clearance),
  sss: toBitOrUndefined(body.SSS ?? body.sss),
  pagibig: toBitOrUndefined(body.PAGIBIG ?? body.pagibig),
  cedula: toBitOrUndefined(body.CEDULA ?? body.cedula),
  vaccination_status: toBitOrUndefined(body.VACCINATION_STATUS ?? body.vaccinationStatus ?? body.vaccination_status),
  resume: toBitOrUndefined(body.RESUME ?? body.resume),
  coe: toBitOrUndefined(body.COE ?? body.coe),
  philhealth: toBitOrUndefined(body.PHILHEALTH ?? body.philhealth),
  tin_number: toBitOrUndefined(body.TIN_NUMBER ?? body.tinNumber ?? body.tin_number),
  nbi_clearance_no: body.NBI_CLEARANCE_NO ?? body.nbiClearanceNo ?? body.nbi_clearance_no,
  sss_no: body.SSS_NO ?? body.sssNo ?? body.sss_no,
  pagibig_no: body.PAGIBIG_NO ?? body.pagibigNo ?? body.pagibig_no,
  philhealth_no: body.PHILHEALTH_NO ?? body.philhealthNo ?? body.philhealth_no,
  tin_no: body.TIN_NO ?? body.tinNo ?? body.tin_no,
});

// Mirrors the auto-log condition in addOrUpdateApplicant: which body fields
// mean "this write carries assessment-relevant data".
const ASSESSMENT_FIELD_KEYS = [
  'REQUIREMENTS_STATUS', 'requirements_status',
  'FINAL_INTERVIEW_STATUS', 'final_interview_status',
  'MEDICAL_STATUS', 'medical_status',
  'DOC_SCREENING_STATUS', 'doc_screening_status',
  'PHYSICAL_SCREENING_STATUS', 'physical_screening_status',
  'STATUS_REMARKS', 'status_remarks',
  'APPLICANT_REMARKS', 'applicant_remarks',
];

const buildAssessmentHistoryEntry = (body, applicantNo) => {
  const hasAssessmentField = ASSESSMENT_FIELD_KEYS.some(
    (k) => body[k] !== undefined && body[k] !== null
  );
  if (!applicantNo || !hasAssessmentField) return null;
  const statusCandidate = body.FINAL_INTERVIEW_STATUS || body.final_interview_status ||
    body.REQUIREMENTS_STATUS || body.requirements_status ||
    body.MEDICAL_STATUS || body.medical_status || '';
  const notesCandidate = body.STATUS_REMARKS || body.status_remarks ||
    body.APPLICANT_REMARKS || body.applicant_remarks || '';
  return {
    applicant_no: applicantNo,
    action: 'Assessment Updated',
    status: String(statusCandidate || ''),
    notes: String(notesCandidate || ''),
  };
};

exports.addOrUpdateApplicant = async (req, res) => {
  try {
    const body = req.body || {};
    const applicantNo = body.NO || body.applicant_no;

    const result = await upsertRecruitmentApplicant(mapBodyToApplicant(body));

    const principalIds = Array.isArray(body.PRINCIPAL_IDS)
      ? body.PRINCIPAL_IDS
      : body.CLIENT_IDS;

    if (Array.isArray(principalIds)) {
      const ids = principalIds
        .map((id) => Number(id))
        .filter((id) => !Number.isNaN(id));
      await setApplicantPrincipals(result.id, ids);
    } else {
      const allPrincipals = await getAllPrincipals();
      const selectedPrincipalIds = [];
      const principalFields = ['DATIAN', 'HOKEI', 'POBC', 'JINBOWAY', 'SURPRISE', 'THALESTE', 'AOLLY', 'ENJOY'];
      let hasPrincipalFields = false;

      for (const principalName of principalFields) {
        const principalValue = body[principalName];
        if (principalValue === 'Ok') {
          hasPrincipalFields = true;
          const principal = allPrincipals.find((p) => p.name === principalName);
          if (principal) selectedPrincipalIds.push(principal.id);
        }
      }

      if (hasPrincipalFields) {
        await setApplicantPrincipals(result.id, selectedPrincipalIds);
      }
    }

    // If assessment-related fields are provided, log to assessment history as a safety net
    try {
      const historyEntry = buildAssessmentHistoryEntry(body, applicantNo);
      if (historyEntry) {
        await addAssessmentHistory(historyEntry);
      }
    } catch (_) {}

    res.json({ ok: true });
  } catch (error) {
    console.error('addOrUpdateApplicant error:', error);
    res.status(500).json({ error: 'Failed to add/update applicant', detail: error?.message });
  }
};

// Bulk upsert for the Excel import: rows are processed sequentially (no
// concurrent SELECT-then-INSERT races, no junction-table deadlocks), and the
// side-writes (principal links, assessment history) are batched into single
// statements per request instead of per row.
const BULK_MAX_ROWS = 500;

exports.bulkUpsertApplicants = async (req, res) => {
  try {
    const rows = req.body && Array.isArray(req.body.rows) ? req.body.rows : null;
    if (!rows) {
      return res.status(400).json({ error: 'Body must be { rows: [...] }' });
    }
    if (rows.length === 0) {
      return res.json({ inserted: 0, updated: 0, failed: [] });
    }
    if (rows.length > BULK_MAX_ROWS) {
      return res.status(400).json({ error: `Too many rows (max ${BULK_MAX_ROWS} per request)` });
    }

    let inserted = 0;
    let updated = 0;
    const failed = [];
    const principalPairs = []; // { applicantId, principalIds }
    const historyEntries = [];

    for (const body of rows) {
      const applicantNo = body.NO || body.applicant_no;
      if (!applicantNo) {
        failed.push({ no: '', error: 'Missing NO / applicant_no' });
        continue;
      }
      try {
        const result = await upsertRecruitmentApplicant(mapBodyToApplicant(body));
        if (result.inserted) inserted++;
        else updated++;

        const principalIds = Array.isArray(body.PRINCIPAL_IDS) ? body.PRINCIPAL_IDS : null;
        if (principalIds && principalIds.length > 0) {
          const ids = principalIds.map(Number).filter((id) => !Number.isNaN(id));
          if (ids.length > 0) principalPairs.push({ applicantId: result.id, principalIds: ids });
        }

        const historyEntry = buildAssessmentHistoryEntry(body, applicantNo);
        if (historyEntry) historyEntries.push(historyEntry);
      } catch (err) {
        failed.push({ no: String(applicantNo), error: err?.message || 'Upsert failed' });
      }
    }

    try {
      if (principalPairs.length > 0) await setApplicantPrincipalsBulk(principalPairs);
    } catch (err) {
      failed.push({ no: '(principal links)', error: err?.message || 'Failed to set principal links' });
    }
    try {
      if (historyEntries.length > 0) await addAssessmentHistoryBulk(historyEntries);
    } catch (err) {
      console.error('bulk history insert error:', err);
    }

    return res.json({ inserted, updated, failed });
  } catch (error) {
    console.error('bulkUpsertApplicants error:', error);
    return res.status(500).json({ error: 'Bulk import failed', detail: error?.message });
  }
};

exports.getApplicantNames = async (req, res) => {
  try {
    const applicants = await fetchRecruitmentApplicants();
    const names = applicants.map(app => ({
      firstName: app.first_name,
      lastName: app.last_name,
    }));
    res.json(names);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicant names' });
  }
};

exports.saveToRecruitment = async (req, res) => {
  try {
    const body = req.body || {};
    await upsertRecruitmentApplicant({
      applicant_no: body.NO || body.applicant_no,
      referred_by: body.REFFERED_BY || body.referred_by,
      last_name: body.LAST_NAME || body.last_name,
      first_name: body.FIRST_NAME || body.first_name,
      ext: body.EXT || body.ext,
      middle_name: body.MIDDLE || body.middle_name,
      gender: body.GENDER || body.gender,
      size: body.SIZE || body.size,
      date_of_birth: body.DATE_OF_BIRTH || body.date_of_birth,
      date_applied: body.DATE_APPLIED || body.date_applied,
      fb_name: body.FB_NAME || body.fb_name,
      age: body.AGE || body.age,
      location: body.LOCATION || body.location,
      contact_number: body.CONTACT_NUMBER || body.contact_number,
      email: body.EMAIL || body.email,
      position_applied_for: body.POSITION_APPLIED_FOR || body.position_applied_for,
      experience: body.EXPERIENCE || body.experience,
      datian: body.DATIAN || body.datian,
      hokei: body.HOKEI || body.hokei,
      pobc: body.POBC || body.pobc,
      jinboway: body.JINBOWAY || body.jinboway,
      surprise: body.SURPRISE || body.surprise,
      thaleste: body.THALESTE || body.thaleste,
      aolly: body.AOLLY || body.aolly,
      enjoy: body.ENJOY || body.enjoy,
      status: body.STATUS || body.status,
      requirements_status: body.REQUIREMENTS_STATUS || body.requirements_status,
      final_interview_status: body.FINAL_INTERVIEW_STATUS || body.final_interview_status,
      medical_status: body.MEDICAL_STATUS || body.medical_status,
      status_remarks: body.STATUS_REMARKS || body.status_remarks,
      applicant_remarks: body.APPLICANT_REMARKS || body.applicant_remarks,
    });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save to recruitment database' });
  }
};

exports.patchApplicant = async (req, res) => {
  try {
    const body = req.body || {};
    const no = body.NO || body.applicant_no;
    if (!no) return res.status(400).json({ error: 'NO is required' });
    const allow = {
      RECENT_PICTURE: 'recent_picture', PSA_BIRTH_CERTIFICATE: 'psa_birth_certificate', SCHOOL_CREDENTIALS: 'school_credentials',
      NBI_CLEARANCE: 'nbi_clearance', POLICE_CLEARANCE: 'police_clearance', BARANGAY_CLEARANCE: 'barangay_clearance',
      SSS: 'sss', PAGIBIG: 'pagibig', CEDULA: 'cedula', VACCINATION_STATUS: 'vaccination_status',
      RESUME: 'resume', COE: 'coe', PHILHEALTH: 'philhealth', TIN_NUMBER: 'tin_number',
      NBI_CLEARANCE_NO: 'nbi_clearance_no', SSS_NO: 'sss_no', PAGIBIG_NO: 'pagibig_no',
      PHILHEALTH_NO: 'philhealth_no', TIN_NO: 'tin_no',
    };
    const toBit = (v) => (v === 1 || v === '1' || v === true) ? 1 : 0;
    const fields = {};
    Object.keys(allow).forEach(k => {
      if (!(k in body)) return;
      const col = allow[k];
      fields[col] = col.endsWith('_no') ? (body[k] ?? null) : toBit(body[k]);
    });
    await updateApplicantFields(no, fields);
    res.json({ ok: true });
  } catch (e) {
    console.error('patchApplicant error:', e);
    res.status(500).json({ error: 'Failed to update applicant', detail: e?.message });
  }
};

exports.getRecruitment = async (req, res) => {
  try {
    const rows = await fetchRecruitmentApplicants();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recruitment applicants' });
  }
};

exports.getScreeningHistory = async (_req, res) => {
  try {
    const rows = await fetchScreeningHistoryEnriched();
    const enriched = rows.map((r) => {
      const fullName = `${r.first_name || ''} ${r.last_name || ''}`.trim();
      const displayName = fullName || r.fb_name || r.applicant_no || '';
      const position = r.position_applied_for || '-';
      const applied = r.date_applied || '';
      return {
        ...r,
        full_name: displayName,
        position_applied_for: position,
        date_applied: applied,
      };
    });
    res.json(enriched);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch screening history' });
  }
};

exports.addScreeningHistory = async (req, res) => {
  try {
    const { applicant_no, action, status, notes } = req.body || {};
    if (!applicant_no) return res.status(400).json({ error: 'applicant_no is required' });
    await addScreeningHistory({ applicant_no, action, status, notes });
    res.json({ ok: true });
  } catch (e) {
    console.error('addScreeningHistory error:', e);
    res.status(500).json({ error: 'Failed to add screening history' });
  }
};

// Assessment history
exports.getAssessmentHistory = async (_req, res) => {
  try {
    let rows = await fetchAssessmentHistoryEnriched();
    // Fallback: if assessment_history is empty, derive from screening history actions
    if (!Array.isArray(rows) || rows.length === 0) {
      const screeningRows = await fetchScreeningHistoryEnriched();
      rows = screeningRows.filter(r => (
        r.action === 'Assessment Updated' ||
        r.action === 'Final Interview - Requirements Complete' ||
        r.action === 'Final Interview - Requirements Incomplete' ||
        r.action === 'Requirements Complete - Proceeded to Medical' ||
        r.action === 'Requirements Incomplete - Returned to Screening' ||
        r.action === 'Initial Interview Complete - Proceeded to Assessment' ||
        r.action === 'Proceeded to Selection'
      ));
    }

    const enriched = rows.map((r) => {
      const fullName = `${r.first_name || ''} ${r.last_name || ''}`.trim();
      const displayName = fullName || r.fb_name || r.applicant_no || '';
      const position = r.position_applied_for || '-';
      const applied = r.date_applied || '';
      return {
        ...r,
        full_name: displayName,
        position_applied_for: position,
        date_applied: applied,
      };
    });
    res.json(enriched);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch assessment history' });
  }
};

exports.addAssessmentHistory = async (req, res) => {
  try {
    const { applicant_no, action, status, notes } = req.body || {};
    if (!applicant_no) return res.status(400).json({ error: 'applicant_no is required' });
    try { console.log('[assessment-history][manual]', { applicant_no, action, status, notes }); } catch (__) {}
    await addAssessmentHistory({ applicant_no, action, status, notes });
    res.json({ ok: true });
  } catch (e) {
    console.error('addAssessmentHistory error:', e);
    res.status(500).json({ error: 'Failed to add assessment history' });
  }
};

// Selection history
exports.getSelectionHistory = async (_req, res) => {
  try {
    const rows = await fetchSelectionHistoryEnriched();
    const enriched = rows.map((r) => {
      const fullName = `${r.first_name || ''} ${r.last_name || ''}`.trim();
      const displayName = fullName || r.fb_name || r.applicant_no || '';
      const position = r.position_applied_for || '-';
      const applied = r.date_applied || '';
      return { ...r, full_name: displayName, position_applied_for: position, date_applied: applied };
    });
    res.json(enriched);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch selection history' });
  }
};

exports.addSelectionHistory = async (req, res) => {
  try {
    const { applicant_no, action, status, notes } = req.body || {};
    if (!applicant_no) return res.status(400).json({ error: 'applicant_no is required' });
    await addSelectionHistory({ applicant_no, action, status, notes });
    res.json({ ok: true });
  } catch (e) {
    console.error('addSelectionHistory error:', e);
    res.status(500).json({ error: 'Failed to add selection history' });
  }
};

// Engagement history
exports.getEngagementHistory = async (_req, res) => {
  try {
    const rows = await fetchEngagementHistoryEnriched();
    const enriched = rows.map((r) => {
      const fullName = `${r.first_name || ''} ${r.last_name || ''}`.trim();
      const displayName = fullName || r.fb_name || r.applicant_no || '';
      const position = r.position_applied_for || '-';
      const applied = r.date_applied || '';
      return { ...r, full_name: displayName, position_applied_for: position, date_applied: applied };
    });
    res.json(enriched);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch engagement history' });
  }
};

exports.addEngagementHistory = async (req, res) => {
  try {
    const { applicant_no, action, status, notes } = req.body || {};
    if (!applicant_no) return res.status(400).json({ error: 'applicant_no is required' });
    await addEngagementHistory({ applicant_no, action, status, notes });
    res.json({ ok: true });
  } catch (e) {
    console.error('addEngagementHistory error:', e);
    res.status(500).json({ error: 'Failed to add engagement history' });
  }
};

exports.getNextApplicantNumber = async (req, res) => {
  try {
    const nextNumber = await getNextApplicantNumber();
    res.json({ applicant_no: nextNumber });
  } catch (error) {
    console.error('getNextApplicantNumber error:', error);
    res.status(500).json({ error: 'Failed to get next applicant number' });
  }
};
