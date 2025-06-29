const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Sheets API configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const SPREADSHEET_ID = process.env.VITE_GOOGLE_SPREADSHEET_ID;
const RANGE = 'Selection Data!A:Z';

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.VITE_GOOGLE_SERVICE_ACCOUNT_KEY || './service-account-key.json',
  scopes: SCOPES,
});

const sheets = google.sheets({ version: 'v4', auth });

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Google Sheets API Server is running' });
});

// Get employee data
app.get('/api/employees', async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.json([]);
    }

    // Skip header row and parse data
    const employees = rows.slice(1).map((row, index) => ({
      id: parseInt(row[0]) || index + 1,
      name: row[1] || '',
      position: row[2] || '',
      medical: row[3] === 'TRUE',
      tradeTest: row[4] === 'TRUE',
      waitText: row[5] === 'TRUE',
      orientation: row[6] === 'TRUE',
      sbma: row[7] === 'TRUE',
      lastUpdated: row[8] || new Date().toISOString(),
    }));

    res.json(employees);
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    res.status(500).json({ error: 'Failed to read from Google Sheets' });
  }
});

// Update employee status
app.put('/api/employees/:id', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);
    const statusUpdates = req.body;

    // First, read current data to find the employee
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: 'No data found' });
    }

    const employeeIndex = rows.findIndex((row, index) => 
      index > 0 && parseInt(row[0]) === employeeId
    );

    if (employeeIndex === -1) {
      return res.status(404).json({ error: `Employee with ID ${employeeId} not found` });
    }

    // Update the employee data
    const currentRow = rows[employeeIndex];
    const updatedRow = [
      currentRow[0], // ID
      currentRow[1], // Name
      currentRow[2], // Position
      statusUpdates.medical ? 'TRUE' : 'FALSE',
      statusUpdates.tradeTest ? 'TRUE' : 'FALSE',
      statusUpdates.waitText ? 'TRUE' : 'FALSE',
      statusUpdates.orientation ? 'TRUE' : 'FALSE',
      statusUpdates.sbma ? 'TRUE' : 'FALSE',
      new Date().toISOString(),
    ];

    // Update the specific row in the spreadsheet
    const rowNumber = employeeIndex + 1; // +1 because we're using 1-based indexing for sheets
    const range = `Selection Data!A${rowNumber}:I${rowNumber}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [updatedRow],
      },
    });

    res.json({ message: `Employee ${employeeId} status updated successfully` });
  } catch (error) {
    console.error('Error updating employee status:', error);
    res.status(500).json({ error: 'Failed to update employee status' });
  }
});

// Sync all employee data
app.post('/api/employees/sync', async (req, res) => {
  try {
    const employees = req.body;

    // Prepare headers
    const headers = [
      'ID',
      'Name',
      'Position',
      'Medical',
      'Trade Test',
      'Wait Text',
      'Orientation',
      'SBMA ID & Gate Pass',
      'Last Updated'
    ];

    // Prepare data rows
    const rows = employees.map(item => [
      item.id.toString(),
      item.name,
      item.position,
      item.medical ? 'TRUE' : 'FALSE',
      item.tradeTest ? 'TRUE' : 'FALSE',
      item.waitText ? 'TRUE' : 'FALSE',
      item.orientation ? 'TRUE' : 'FALSE',
      item.sbma ? 'TRUE' : 'FALSE',
      new Date().toISOString(),
    ]);

    // Combine headers and data
    const values = [headers, ...rows];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    res.json({ message: 'Data synced to Google Sheets successfully' });
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
    res.status(500).json({ error: 'Failed to sync to Google Sheets' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Google Sheets API Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
}); 