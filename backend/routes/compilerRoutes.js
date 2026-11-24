const express = require('express');
const router = express.Router();
const {
  getLanguages,
  executeCode,
  executeLocalJS,
} = require('../controllers/compilerController');
const { protect } = require('../middleware/auth');

router.get('/languages', getLanguages);
router.post('/execute', protect, executeCode);
router.post('/execute-local', protect, executeLocalJS);

module.exports = router;

