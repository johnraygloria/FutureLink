const { ensureUserTable } = require('./models/user');

async function testEnsure() {
    try {
        console.log('Testing ensureUserTable...');
        await ensureUserTable();
        console.log('Success!');
        process.exit(0);
    } catch (err) {
        console.error('Failed ensureUserTable:', err.message);
        process.exit(1);
    }
}

testEnsure();
