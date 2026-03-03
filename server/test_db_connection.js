const mysql = require('mysql2/promise');
const config = require('./config');

async function testConnection() {
    try {
        const pool = mysql.createPool({
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
        });
        console.log('Testing connection to:', config.DB_HOST, config.DB_NAME);
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Success! Result:', rows[0].result);
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:', err.message);
        process.exit(1);
    }
}

testConnection();
