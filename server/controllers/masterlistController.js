const {
  getAllEmployees,
  insertEmployee,
  updateEmployeeFields,
  initializeMasterlist,
} = require('../models/masterlist');

const VALID_STATUSES = new Set(['ACTIVE', 'RESIGNED', 'TERMINATED']);
const VALID_EMPLOYMENT_STATUSES = new Set(['REGULAR', 'PROBATIONARY']);

async function getEmployees(req, res) {
  try {
    const employees = await getAllEmployees();
    res.json(employees);
  } catch (error) {
    console.error('Error fetching masterlist employees:', error);
    res.status(500).json({ error: 'Failed to fetch masterlist employees' });
  }
}

async function createEmployee(req, res) {
  try {
    const body = req.body || {};
    const empId = String(body.emp_id || body.empId || '').trim();

    if (!empId) {
      return res.status(400).json({ error: 'Employee ID is required' });
    }

    const status = body.status || 'ACTIVE';
    if (!VALID_STATUSES.has(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const employmentStatus = body.employment_status || body.employmentStatus || 'PROBATIONARY';
    if (!VALID_EMPLOYMENT_STATUSES.has(employmentStatus)) {
      return res.status(400).json({ error: 'Invalid employment status' });
    }

    const employee = await insertEmployee({
      emp_id: empId,
      last_name: body.last_name || body.lastName,
      first_name: body.first_name || body.firstName,
      ext_name: body.ext_name || body.extName,
      middle_name: body.middle_name || body.middleName,
      mobile_number: body.mobile_number || body.mobileNumber,
      address: body.address,
      gender: body.gender,
      date_hired: body.date_hired || body.dateHired,
      status,
      employment_status: employmentStatus,
      remarks: body.remarks,
      position: body.position,
      dept_line: body.dept_line || body.deptLine,
      section: body.section,
      building: body.building,
      shift: body.shift || 'DAY',
      applicant_no: body.applicant_no || body.applicantNo,
    });

    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Employee ID already exists' });
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
    const fields = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.has(body.status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      fields.status = body.status;
    }

    const employmentStatus = body.employment_status ?? body.employmentStatus;
    if (employmentStatus !== undefined) {
      if (!VALID_EMPLOYMENT_STATUSES.has(employmentStatus)) {
        return res.status(400).json({ error: 'Invalid employment status' });
      }
      fields.employment_status = employmentStatus;
    }

    if (body.remarks !== undefined) {
      fields.remarks = body.remarks;
    }

    const employee = await updateEmployeeFields(parseInt(id, 10), fields);

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found or no changes provided' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error updating masterlist employee:', error);
    res.status(500).json({ error: 'Failed to update employee' });
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
  createEmployee,
  patchEmployee,
  syncEmployees,
};
