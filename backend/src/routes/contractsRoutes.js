const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  getContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  uploadContractFile,
  getDashboardStats,
} = require('../controllers/contractsController');
const { authMiddleware, requireRole } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`),
});

const upload = multer({ storage });

router.use(authMiddleware);

router.get('/dashboard/stats', getDashboardStats);
router.get('/', getContracts);
router.get('/:id', getContractById);
router.post('/', requireRole(['Admin', 'Staff']), createContract);
router.put('/:id', requireRole(['Admin']), updateContract);
router.delete('/:id', requireRole(['Admin']), deleteContract);
router.post('/:id/upload', requireRole(['Admin', 'Staff']), upload.single('file'), uploadContractFile);

module.exports = router;
