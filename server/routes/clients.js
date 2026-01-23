const express = require('express');
const router = express.Router();
const {
  getClients,
  createClient,
  removeClient,
  initDefaultClients,
} = require('../controllers/clientsController');

// Get all clients
router.get('/', getClients);

// Create a new client
router.post('/', createClient);

// Delete a client
router.delete('/:id', removeClient);

// Initialize default clients (for migration)
router.post('/init-defaults', initDefaultClients);

module.exports = router;