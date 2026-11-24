const express = require('express');
const router = express.Router();
const {
  askAI,
  getAIHistory,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/ask', protect, askAI);
router.get('/history', protect, getAIHistory);

module.exports = router;

