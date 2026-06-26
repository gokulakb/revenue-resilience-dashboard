const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { run, get, all } = require('./database');

const dbDirectory = path.join(__dirname, 'database');
fs.mkdirSync(dbDirectory, { recursive: true });

const initializeDatabase = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT NOT NULL,
      gateway_response TEXT,
      idempotency_key TEXT UNIQUE,
      retry_count INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS cohorts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cohort_name TEXT NOT NULL,
      user_count INTEGER NOT NULL,
      payment_count INTEGER NOT NULL,
      total_revenue REAL DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const userCountRow = await get('SELECT COUNT(*) AS count FROM users');
  if (userCountRow.count === 0) {
    for (let index = 1; index <= 50; index += 1) {
      await run('INSERT INTO users (name, email) VALUES (?, ?)', [
        `User ${index}`,
        `user${index}@example.com`
      ]);
    }
  }

  const paymentCountRow = await get('SELECT COUNT(*) AS count FROM payments');
  if (paymentCountRow.count === 0) {
    const users = await all('SELECT id FROM users');
    for (let index = 1; index <= 150; index += 1) {
      const user = users[(index - 1) % users.length];
      const amount = Number((10 + Math.random() * 300).toFixed(2));
      const status = Math.random() < 0.7 ? 'succeeded' : 'failed';
      const gatewayResponse = status === 'succeeded' ? 'approved' : 'simulated_gateway_failure';
      await run(
        `INSERT INTO payments (user_id, amount, currency, status, gateway_response, idempotency_key, retry_count) VALUES (?, ?, ?, ?, ?, ?, 0)`,
        [user.id, amount, 'USD', status, gatewayResponse, uuidv4()]
      );
    }
  }

  const cohortCountRow = await get('SELECT COUNT(*) AS count FROM cohorts');
  if (cohortCountRow.count === 0) {
    const cohortSeed = [
      { cohort_name: 'Q1-2024', user_count: 16, payment_count: 48, total_revenue: 12800 },
      { cohort_name: 'Q2-2024', user_count: 14, payment_count: 42, total_revenue: 11250 },
      { cohort_name: 'Q3-2024', user_count: 12, payment_count: 36, total_revenue: 9800 },
      { cohort_name: 'Q4-2024', user_count: 8, payment_count: 24, total_revenue: 6500 }
    ];

    for (const cohort of cohortSeed) {
      await run(
        'INSERT INTO cohorts (cohort_name, user_count, payment_count, total_revenue) VALUES (?, ?, ?, ?)',
        [cohort.cohort_name, cohort.user_count, cohort.payment_count, cohort.total_revenue]
      );
    }
  }

  return true;
};

module.exports = { initializeDatabase };

if (require.main === module) {
  initializeDatabase()
    .then(() => console.log('Database initialized successfully'))
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}
