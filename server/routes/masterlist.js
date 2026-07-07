const express = require('express');
const router = express.Router();
const {
  getEmployees,
  getNextFli,
  createEmployee,
  patchEmployee,
  removeEmployee,
  syncEmployees,
} = require('../controllers/masterlistController');

router.get('/', getEmployees);
router.get('/next-fli', getNextFli);
router.post('/', createEmployee);
router.patch('/:id', patchEmployee);
router.delete('/:id', removeEmployee);
router.post('/sync', syncEmployees);

module.exports = router;
