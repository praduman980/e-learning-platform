const express = require('express');
const router = express.Router();
const {
  getLectures,
  createLecture,
  updateLecture,
  deleteLecture,
  completeLecture,
} = require('../controllers/lectureController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/courses/:courseId/lectures', optionalAuth, getLectures);
router.post('/courses/:courseId/lectures', protect, authorize('teacher', 'admin'), createLecture);
router.put('/lectures/:id', protect, authorize('teacher', 'admin'), updateLecture);
router.delete('/lectures/:id', protect, authorize('teacher', 'admin'), deleteLecture);
router.post('/lectures/:id/complete', protect, completeLecture);

module.exports = router;

