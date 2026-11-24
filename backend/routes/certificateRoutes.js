const express = require('express');
const router = express.Router();
const {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
  downloadCertificate,
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateCertificate);
router.get('/my', protect, getMyCertificates);
router.get('/verify/:certificateId', verifyCertificate);
router.get('/:id/download', protect, downloadCertificate);

module.exports = router;

