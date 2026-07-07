const {
  getAllEmployees,
  getNextFliNumber,
  insertEmployee,
  updateEmployeeFields,
  deleteEmployee,
  initializeMasterlist,
} = require('../models/masterlist');

const VALID_STATUSES = new Set(['ACTIVE', 'RESIGNED', 'TERMINATED']);

async function getEmployees(req, res) {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching masterlist employees:', error);
    res.status(500).json({ error: 'Failed to fetch masterlist employees' });
  }
}

async function getNextFli(req, res) {
  try {
    const fliNumber = await getNextFliNumber();
    res.json({ fliNumber });
  } catch (error) {
    console.error('Error fetching next FLI number:', error);
    res.status(500).json({ error: 'Failed to fetch next FLI number' });
  }
}

async function createEmployee(req, res) {
  try {
    const body = req.body || {};
    const lastName = String(body.last_name || body.lastName || '').trim();
    const firstName = String(body.first_name || body.firstName || '').trim();

    if (!lastName || !firstName) {
      return res.status(400).json({ error: 'Last name and first name are required' });
    }

    const status = body.status || 'ACTIVE';
    if (!VALID_STATUSES.has(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const employee = await insertEmployee({
      ...body,
      last_name: lastName,
      first_name: firstName,
      status,
    });

    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Employee record already exists' });
    }
    console.error('Error creating masterlist employee:', error);
    res.status(500).json({ error: 'Failed to create employee' });
  }
}

async function patchEmployee(req, res) {
  try {
    const { id } = req.params;
    if (!id || Number.isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'Valid employee ID is required' });
    }

    const body = req.body || {};

    if (body.status !== undefined && !VALID_STATUSES.has(body.status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const employee = await updateEmployeeFields(parseInt(id, 10), body);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found or no changes provided' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error updating masterlist employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
  }
}

async function removeEmployee(req, res) {
  try {
    const { id } = req.params;
    if (!id || Number.isNaN(parseInt(id, 10))) {
      return res.status(400).json({ error: 'Valid employee ID is required' });
    }

    const deleted = await deleteEmployee(parseInt(id, 10));
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting masterlist employee:', error);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
}

async function syncEmployees(req, res) {
  try {
    await initializeMasterlist();
    const employees = await getAllEmployees();
    res.json({ success: true, employees, count: employees.length });
  } catch (error) {
    console.error('Error syncing masterlist employees:', error);
    res.status(500).json({ error: 'Failed to sync masterlist employees' });
  }
}

module.exports = {
  getEmployees,
  getNextFli,
  createEmployee,
  patchEmployee,
  removeEmployee,
  syncEmployees,
};
