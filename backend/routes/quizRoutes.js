const express = require('express');
const router = express.Router();
const {
  getQuiz,
  createQuiz,
  submitQuiz,
  updateQuiz,
} = require('../controllers/quizController');
const { protect, authorize } = require('../middleware/auth');

router.get('/courses/:courseId/quiz', protect, getQuiz);
router.post('/courses/:courseId/quiz', protect, authorize('teacher', 'admin'), createQuiz);
router.post('/quiz/:id/submit', protect, submitQuiz);
router.put('/quiz/:id', protect, authorize('teacher', 'admin'), updateQuiz);

module.exports = router;

