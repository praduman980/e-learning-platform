const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getTeacherCourses,
} = require('../controllers/courseController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', getCourses);
router.get('/teacher', protect, authorize('teacher', 'admin'), getTeacherCourses);
router.get('/:id', optionalAuth, getCourseById);
router.post('/', protect, authorize('teacher', 'admin'), createCourse);
router.put('/:id', protect, authorize('teacher', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('teacher', 'admin'), deleteCourse);
router.post('/:id/enroll', protect, enrollCourse);

module.exports = router;

