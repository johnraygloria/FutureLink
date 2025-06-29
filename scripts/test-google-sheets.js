#!/usr/bin/env node

/**
 * Test script for Google Sheets integration
 * Run this script to verify your Google Sheets setup is working correctly
 */

import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

// Load environment variables
const SPREADSHEET_ID = process.env.VITE_GOOGLE_SPREADSHEET_ID;
const SERVICE_ACCOUNT_KEY_PATH = process.env.VITE_GOOGLE_SERVICE_ACCOUNT_KEY || './service-account-key.json';

async function testGoogleSheetsConnection() {
  console.log('🔍 Testing Google Sheets Integration...\n');

  // Check if environment variables are set
  if (!SPREADSHEET_ID) {
    console.error('❌ VITE_GOOGLE_SPREADSHEET_ID is not set in your .env file');
    return false;
  }

  // Check if service account key file exists
  if (!fs.existsSync(SERVICE_ACCOUNT_KEY_PATH)) {
    console.error(`❌ Service account key file not found: ${SERVICE_ACCOUNT_KEY_PATH}`);
    console.log('📝 Please download your service account key and save it as service-account-key.json');
    return false;
  }

  try {
    // Initialize Google Sheets API
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_KEY_PATH,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('✅ Service account key file found');
    console.log('✅ Google Sheets API initialized');

    // Test reading from spreadsheet
    console.log('\n📖 Testing read access...');
    const readResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Selection Data!A1:I10',
    });

    console.log('✅ Successfully read from spreadsheet');
    console.log(`📊 Found ${readResponse.data.values?.length || 0} rows of data`);

    // Test writing to spreadsheet
    console.log('\n✍️  Testing write access...');
    const testData = [
      ['Test ID', 'Test Name', 'Test Position', 'FALSE', 'FALSE', 'FALSE', 'FALSE', 'FALSE', new Date().toISOString()]
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Selection Data!A1:I1',
      valueInputOption: 'RAW',
      requestBody: {
        values: testData,
      },
    });

    console.log('✅ Successfully wrote to spreadsheet');

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...');
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Selection Data!A1:I1',
    });

    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All tests passed! Your Google Sheets integration is working correctly.');
    console.log('\n📋 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Navigate to the Selection page');
    console.log('3. You should see "Connected to Google Sheets" status');
    console.log('4. Try updating employee selection status');

    return true;

  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
    
    if (error.code === 403) {
      console.log('\n💡 This might be a permissions issue. Please check:');
      console.log('1. The spreadsheet is shared with your service account email');
      console.log('2. The service account has "Editor" permissions');
      console.log('3. The spreadsheet ID is correct');
    } else if (error.code === 404) {
      console.log('\n💡 Spreadsheet not found. Please check:');
      console.log('1. The spreadsheet ID is correct');
      console.log('2. The spreadsheet exists and is accessible');
    }

    return false;
  }
}

// Run the test
testGoogleSheetsConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });   