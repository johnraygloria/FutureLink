const express = require('express');
const router = express.Router();
const {
  getPrincipals,
  createPrincipal,
  removePrincipal,
  initDefaultPrincipals,
} = require('../controllers/principalsController');

router.get('/', getPrincipals);
router.post('/', createPrincipal);
router.delete('/:id', removePrincipal);
router.post('/init-defaults', initDefaultPrincipals);

module.exports = router;
