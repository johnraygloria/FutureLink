const {
  getAllPrincipals,
  addPrincipal,
  deletePrincipal,
  initializeDefaultPrincipals,
} = require('../models/principal');

async function getPrincipals(req, res) {
  try {
    const principals = await getAllPrincipals();
    res.json(principals);
  } catch (error) {
    console.error('Error fetching principals:', error);
    res.status(500).json({ error: 'Failed to fetch principals' });
  }
}

async function createPrincipal(req, res) {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Principal name is required' });
    }

    const trimmedName = name.trim().toUpperCase();
    const result = await addPrincipal(trimmedName);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Principal already exists') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Error creating principal:', error);
    res.status(500).json({ error: 'Failed to create principal' });
  }
}

async function removePrincipal(req, res) {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'Valid principal ID is required' });
    }

    const deleted = await deletePrincipal(parseInt(id, 10));

    if (!deleted) {
      return res.status(404).json({ error: 'Principal not found' });
    }

    res.json({ success: true, message: 'Principal deleted successfully' });
  } catch (error) {
    console.error('Error deleting principal:', error);
    res.status(500).json({ error: 'Failed to delete principal' });
  }
}

async function initDefaultPrincipals(req, res) {
  try {
    await initializeDefaultPrincipals();
    const principals = await getAllPrincipals();
    res.json({ success: true, principals, message: 'Default principals initialized' });
  } catch (error) {
    console.error('Error initializing default principals:', error);
    res.status(500).json({ error: 'Failed to initialize default principals' });
  }
}

module.exports = {
  getPrincipals,
  createPrincipal,
  removePrincipal,
  initDefaultPrincipals,
};
