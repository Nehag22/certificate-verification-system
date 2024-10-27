const express = require('express');
const multer = require('multer');
const router = express.Router();
const {
  uploadExcel,
  getCertificateById,
  downloadCertificate,
  downloadDummyData,
} = require('../controllers/certificateController');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.post('/upload-excel', upload.single('file'), uploadExcel);
router.get('/certificates/:id', getCertificateById);
router.get('/download-certificate/:id', downloadCertificate);
router.get('/download-dummy-data', downloadDummyData);

module.exports = router;
