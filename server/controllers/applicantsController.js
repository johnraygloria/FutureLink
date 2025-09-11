const { insertRecruitmentApplicant, fetchRecruitmentApplicants, upsertRecruitmentApplicant, updateApplicantFields, addScreeningHistory, fetchScreeningHistory } = require('../models/applicant');


exports.createApplicant = (req, res) => {
  res.status(201).json({ message: 'Applicant created', data: req.body });
};

exports.getApplicants = async (req, res) => {
  try {
    const applicants = await fetchRecruitmentApplicants();
    const { NO } = req.query;
    if (NO) {
      const filtered = applicants.filter(a => String(a.applicant_no || '') === String(NO));
      return res.json(filtered);
    }
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
};

const toBit = (v) => (v === 1 || v === '1' || v === true) ? 1 : 0;
// Return undefined when value is not provided, so the model layer can pass NULL
// and preserve existing DB values via IFNULL(...) during UPDATE
const toBitOrUndefined = (v) => (v === undefined ? undefined : toBit(v));

exports.addOrUpdateApplicant = async (req, res) => {
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
    });
    res.json({ ok: true });
  } catch (error) {
    console.error('addOrUpdateApplicant error:', error);
    res.status(500).json({ error: 'Failed to add/update applicant', detail: error?.message });
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
    };
    const toBit = (v) => (v === 1 || v === '1' || v === true) ? 1 : 0;
    const fields = {};
    Object.keys(allow).forEach(k => {
      if (k in body) fields[allow[k]] = toBit(body[k]);
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
    const rows = await fetchScreeningHistory();
    res.json(rows);
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