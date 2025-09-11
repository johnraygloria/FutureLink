const express = require('express');
const router = express.Router();
const applicantsController = require('../controllers/applicantsController');

// GET applicants (from MySQL recruitment table)
router.get('/', applicantsController.getApplicants);
// POST applicant (upsert into MySQL recruitment table)
router.post('/', applicantsController.addOrUpdateApplicant);
// GET applicant names (from MySQL)
router.get('/names', applicantsController.getApplicantNames);
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
// Patch specific applicant fields
router.patch('/', applicantsController.patchApplicant);

module.exports = router; 