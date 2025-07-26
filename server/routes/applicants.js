const express = require('express');
const router = express.Router();
const applicantsController = require('../controllers/applicantsController');

// GET applicants
router.get('/', applicantsController.getApplicants);
// POST applicant
router.post('/', applicantsController.addOrUpdateApplicant);
// GET applicant names
router.get('/names', applicantsController.getApplicantNames);

module.exports = router; 