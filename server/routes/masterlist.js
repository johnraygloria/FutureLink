const express = require('express');
const router = express.Router();
const {
  getEmployees,
  createEmployee,
  patchEmployee,
  syncEmployees,
} = require('../controllers/masterlistController');

router.get('/', getEmployees);
router.post('/', createEmployee);
router.patch('/:id', patchEmployee);
router.post('/sync', syncEmployees);

module.exports = router;
