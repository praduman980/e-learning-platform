const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get all courses
// @route   GET /api/courses
const getCourses = asyncHandler(async (req, res) => {
  const { category, level, search, page = 1, limit = 12 } = req.query;

  let query = { published: true };

  if (category && category !== 'all') {
    query.category = category;
  }
  if (level && level !== 'all') {
    query.level = level;
  }
  if (search) {
    query.$text = { $search: search };
  }

  const courses = await Course.find(query)
    .populate('teacher', 'name email avatar')
    .select('-lectures -quizzes -enrolledStudents')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Course.countDocuments(query);

  res.json({
    courses,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    total,
  });
});

// @desc    Get single course
// @route   GET /api/courses/:id
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('teacher', 'name email avatar')
    .populate('lectures')
    .populate('quizzes');

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if user is enrolled
  let isEnrolled = false;
  if (req.user) {
    isEnrolled = course.enrolledStudents.includes(req.user._id);
  }

  res.json({ course, isEnrolled });
});

// @desc    Create a course (teacher)
// @route   POST /api/courses
const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    level,
    price,
    isFree,
    requirements,
    whatYouWillLearn,
  } = req.body;

  const course = await Course.create({
    title,
    description,
    category,
    level,
    price: isFree ? 0 : price,
    isFree,
    teacher: req.user._id,
    requirements: requirements || [],
    whatYouWillLearn: whatYouWillLearn || [],
  });

  // Add course to teacher's created courses
  await User.findByIdAndUpdate(req.user._id, {
    $push: { createdCourses: course._id },
  });

  res.status(201).json(course);
});

// @desc    Update a course (teacher)
// @route   PUT /api/courses/:id
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to update this course');
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedCourse);
});

// @desc    Delete a course (teacher)
// @route   DELETE /api/courses/:id
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.teacher.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this course');
  }

  await Course.findByIdAndDelete(req.params.id);

  // Remove from teacher's created courses
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { createdCourses: req.params.id },
  });

  res.json({ message: 'Course deleted successfully' });
});

// @desc    Enroll in a course (student)
// @route   POST /api/courses/:id/enroll
const enrollCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.enrolledStudents.some((id) => id.toString() === req.user._id.toString())) {
    res.status(400);
    throw new Error('Already enrolled in this course');
  }

  course.enrolledStudents.push(req.user._id);
  await course.save();

  await User.findByIdAndUpdate(req.user._id, {
    $push: {
      enrolledCourses: {
        course: course._id,
        enrolledAt: new Date(),
        progress: 0,
        completedLectures: [],
      },
    },
  });

  res.json({ message: 'Enrolled successfully' });
});

// @desc    Get teacher's courses
// @route   GET /api/courses/teacher
const getTeacherCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ teacher: req.user._id })
    .populate('lectures')
    .sort({ createdAt: -1 });

  res.json(courses);
});

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  getTeacherCourses,
};

