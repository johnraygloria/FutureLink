const googleSheetsService = require('../services/googleSheetsService');

// Placeholder controller for applicants


exports.createApplicant = (req, res) => {
  res.status(201).json({ message: 'Applicant created', data: req.body });
};

exports.getApplicants = async (req, res) => {
  try {
    const applicants = await googleSheetsService.fetchApplicants();
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicants' });
  }
};

exports.addOrUpdateApplicant = async (req, res) => {
  try {
    const result = await googleSheetsService.addOrUpdateApplicant(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add/update applicant' });
  }
};

exports.getApplicantNames = async (req, res) => {
  try {
    const applicants = await googleSheetsService.fetchApplicants();
    const names = applicants.map(app => ({
      firstName: app.firstName,
      lastName: app.lastName
    }));
    res.json(names);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applicant names' });
  }
}; 