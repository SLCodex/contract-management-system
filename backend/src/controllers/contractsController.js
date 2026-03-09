const pool = require('../config/db');
const { computeStatus } = require('../utils/status');

const allowedStatuses = ['Draft', 'Pending Approval', 'Active', 'Expiring Soon', 'Expired', 'Terminated'];

function normalizeStatus(status) {
  return typeof status === 'string' ? status.trim() : status;
}

async function logActivity(userId, action, contractId) {
  await pool.query(
    'INSERT INTO activity_logs (user_id, action, contract_id) VALUES ($1, $2, $3)',
    [userId, action, contractId]
  );
}

async function getContracts(req, res) {
  const { search = '', status = '', department = '' } = req.query;

  try {
    const result = await pool.query(
      `SELECT c.*, u.name AS created_by_name
       FROM contracts c
       LEFT JOIN users u ON c.created_by = u.id
       WHERE ($1 = '' OR c.title ILIKE $2 OR c.contract_no ILIKE $2 OR c.vendor_name ILIKE $2)
       AND ($3 = '' OR c.status = $3)
       AND ($4 = '' OR c.department ILIKE $4)
       ORDER BY c.updated_at DESC`,
      [search, `%${search}%`, status, `%${department}%`]
    );

    return res.json({ data: result.rows });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch contracts', error: error.message });
  }
}

async function getContractById(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    return res.json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch contract', error: error.message });
  }
}

async function createContract(req, res) {
  const {
    contract_no,
    title,
    vendor_name,
    department,
    start_date,
    end_date,
    amount,
    status = 'Pending Approval',
    description = '',
  } = req.body;

  if (!contract_no || !title || !vendor_name || !department || !start_date || !end_date || amount === undefined) {
    return res.status(400).json({ message: 'Required fields are missing' });
  }

  const normalizedStatus = normalizeStatus(status);

  if (!allowedStatuses.includes(normalizedStatus)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  const computedStatus = computeStatus(end_date, normalizedStatus);

  if (!allowedStatuses.includes(computedStatus)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO contracts
      (contract_no, title, vendor_name, department, start_date, end_date, amount, status, description, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *`,
      [contract_no, title, vendor_name, department, start_date, end_date, amount, computedStatus, description, req.user.id]
    );

    await logActivity(req.user.id, 'CREATE_CONTRACT', result.rows[0].id);

    return res.status(201).json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Could not create contract', error: error.message });
  }
}

async function updateContract(req, res) {
  const { id } = req.params;
  const {
    contract_no,
    title,
    vendor_name,
    department,
    start_date,
    end_date,
    amount,
    status,
    description,
  } = req.body;

  try {
    const existing = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);

    if (!existing.rows.length) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const current = existing.rows[0];
    const normalizedStatus = normalizeStatus(status);
    const currentStatus = normalizeStatus(current.status);
    const nextStatus = normalizedStatus || currentStatus;

    if (normalizedStatus && !allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const computedStatus = computeStatus(end_date || current.end_date, nextStatus);

    if (!allowedStatuses.includes(computedStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const result = await pool.query(
      `UPDATE contracts SET
        contract_no = $1,
        title = $2,
        vendor_name = $3,
        department = $4,
        start_date = $5,
        end_date = $6,
        amount = $7,
        status = $8,
        description = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *`,
      [
        contract_no || current.contract_no,
        title || current.title,
        vendor_name || current.vendor_name,
        department || current.department,
        start_date || current.start_date,
        end_date || current.end_date,
        amount ?? current.amount,
        computedStatus,
        description ?? current.description,
        id,
      ]
    );

    await logActivity(req.user.id, 'UPDATE_CONTRACT', Number(id));

    return res.json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Could not update contract', error: error.message });
  }
}


async function approveContract(req, res) {
  const { id } = req.params;

  try {
    const existing = await pool.query('SELECT * FROM contracts WHERE id = $1', [id]);

    if (!existing.rows.length) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    const contract = existing.rows[0];

    if (contract.status !== 'Pending Approval') {
      return res.status(400).json({ message: 'Only pending approval contracts can be approved' });
    }

    const approvedStatus = computeStatus(contract.end_date, 'Active');

    const result = await pool.query(
      `UPDATE contracts SET
        status = $1,
        approved_by = $2,
        approved_at = NOW(),
        updated_at = NOW()
      WHERE id = $3
      RETURNING *`,
      [approvedStatus, req.user.id, id]
    );

    await logActivity(req.user.id, 'APPROVE_CONTRACT', Number(id));

    return res.json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Could not approve contract', error: error.message });
  }
}

async function deleteContract(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM contracts WHERE id = $1 RETURNING id', [id]);

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    await logActivity(req.user.id, 'DELETE_CONTRACT', Number(id));

    return res.json({ message: 'Contract deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Could not delete contract', error: error.message });
  }
}

async function uploadContractFile(req, res) {
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const filePath = `uploads/${req.file.filename}`;
    const result = await pool.query(
      'UPDATE contracts SET file_path = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [filePath, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Contract not found' });
    }

    await logActivity(req.user.id, 'UPLOAD_CONTRACT_FILE', Number(id));

    return res.json({ data: result.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: 'Could not upload file', error: error.message });
  }
}

async function getDashboardStats(req, res) {
  try {
    const total = await pool.query('SELECT COUNT(*)::int AS count FROM contracts');
    const active = await pool.query("SELECT COUNT(*)::int AS count FROM contracts WHERE status = 'Active'");
    const expSoon = await pool.query("SELECT COUNT(*)::int AS count FROM contracts WHERE status = 'Expiring Soon'");
    const expired = await pool.query("SELECT COUNT(*)::int AS count FROM contracts WHERE status = 'Expired'");

    return res.json({
      total: total.rows[0].count,
      active: active.rows[0].count,
      expiringSoon: expSoon.rows[0].count,
      expired: expired.rows[0].count,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Could not fetch dashboard stats', error: error.message });
  }
}

module.exports = {
  getContracts,
  getContractById,
  createContract,
  updateContract,
  approveContract,
  deleteContract,
  uploadContractFile,
  getDashboardStats,
};
