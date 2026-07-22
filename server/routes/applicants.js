const express = require('express');
const router = express.Router();
const applicantsController = require('../controllers/applicantsController');

// GET applicants (from MySQL recruitment table)
router.get('/', applicantsController.getApplicants);
// POST applicant (upsert into MySQL recruitment table)
router.post('/', applicantsController.addOrUpdateApplicant);
// Bulk upsert (Excel import)
router.post('/bulk', applicantsController.bulkUpsertApplicants);
// TEMPORARY: sweep out fully-empty placeholder rows (called after bulk import)
router.post('/cleanup-empty', applicantsController.cleanupEmptyApplicants);
// GET applicant names (from MySQL)
router.get('/names', applicantsController.getApplicantNames);
// GET applicant numbers only (lightweight, for import preview)
router.get('/numbers', applicantsController.getApplicantNumbers);
// Save to recruitment DB (MySQL)
router.post('/recruitment', applicantsController.saveToRecruitment);
// Get recruitment list
router.get('/recruitment', applicantsController.getRecruitment);
router.get('/screening-history', applicantsController.getScreeningHistory);
router.post('/screening-history', async (req, res, next) => {
  try {
    await applicantsController.addScreeningHistory(req, res);
  } catch (e) { next(e); }
});
// Assessment history
router.get('/assessment-history', applicantsController.getAssessmentHistory);
router.post('/assessment-history', async (req, res, next) => {
  try {
    await applicantsController.addAssessmentHistory(req, res);
  } catch (e) { next(e); }
});

// Selection history
router.get('/selection-history', applicantsController.getSelectionHistory);
router.post('/selection-history', async (req, res, next) => {
  try {
    await applicantsController.addSelectionHistory(req, res);
  } catch (e) { next(e); }
});

// Engagement history
router.get('/engagement-history', applicantsController.getEngagementHistory);
router.post('/engagement-history', async (req, res, next) => {
  try {
    await applicantsController.addEngagementHistory(req, res);
  } catch (e) { next(e); }
});
// Patch specific applicant fields
router.patch('/', applicantsController.patchApplicant);
// Get next applicant number
router.get('/next-number', applicantsController.getNextApplicantNumber);

module.exports = router; 