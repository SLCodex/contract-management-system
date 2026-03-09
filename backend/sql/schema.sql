CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('Admin', 'Staff')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id SERIAL PRIMARY KEY,
  contract_no VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  vendor_name VARCHAR(150) NOT NULL,
  department VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('Draft', 'Active', 'Expiring Soon', 'Expired', 'Terminated')),
  description TEXT,
  file_path TEXT,
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  contract_id INTEGER REFERENCES contracts(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
