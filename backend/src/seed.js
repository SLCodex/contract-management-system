require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function seed() {
  try {
    const adminHash = await bcrypt.hash('admin123', 10);
    const staffHash = await bcrypt.hash('staff123', 10);

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES
       ('Admin User', 'admin@example.com', $1, 'Admin'),
       ('Staff User', 'staff@example.com', $2, 'Staff')
       ON CONFLICT (email) DO NOTHING`,
      [adminHash, staffHash]
    );

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await pool.end();
  }
}

seed();
