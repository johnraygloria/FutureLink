const mysql = require('mysql2/promise');
const config = require('./config');

async function checkTable() {
    try {
        const pool = mysql.createPool(config.DB_HOST === '127.0.0.1' ? {
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
        } : {
            host: config.DB_HOST,
            user: config.DB_USER,
            password: config.DB_PASSWORD,
            database: config.DB_NAME,
        });
        const [rows] = await pool.query('DESCRIBE users');
        console.log('Columns: ' + rows.map(r => r.Field).join(', '));
        process.exit(0);
    } catch (err) {
        console.error('Failed to describe table:', err.message);
        process.exit(1);
    }
}

checkTable();
