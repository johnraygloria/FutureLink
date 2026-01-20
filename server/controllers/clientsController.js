const {
  getAllClients,
  addClient,
  deleteClient,
  initializeDefaultClients,
} = require('../models/client');

async function getClients(req, res) {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
}

async function createClient(req, res) {
  try {
    const { name } = req.body;
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Client name is required' });
    }

    const trimmedName = name.trim().toUpperCase();
    
    const result = await addClient(trimmedName);
    res.status(201).json(result);
  } catch (error) {
    if (error.message === 'Client already exists') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
}

async function removeClient(req, res) {
  try {
    const { id } = req.params;
    
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid client ID is required' });
    }

    const deleted = await deleteClient(parseInt(id));
    
    if (!deleted) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
}

async function initDefaultClients(req, res) {
  try {
    await initializeDefaultClients();
    const clients = await getAllClients();
    res.json({ success: true, clients, message: 'Default clients initialized' });
  } catch (error) {
    console.error('Error initializing default clients:', error);
    res.status(500).json({ error: 'Failed to initialize default clients' });
  }
}

module.exports = {
  getClients,
  createClient,
  removeClient,
  initDefaultClients,
};