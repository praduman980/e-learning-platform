const asyncHandler = require('express-async-handler');
const Lecture = require('../models/Lecture');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get lectures for a course
// @route   GET /api/courses/:courseId/lectures
const getLectures = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const lectures = await Lecture.find({ course: req.params.courseId }).sort({
    order: 1,
  });

  // If not enrolled, only show free lectures
  if (
    !req.user ||
    (!course.enrolledStudents.some((id) => id.toString() === req.user._id.toString()) &&
      course.teacher.toString() !== req.user._id.toString())
  ) {
    const freeLectures = lectures.filter((l) => l.isFree);
    return res.json(freeLectures);
  }

  res.json(lectures);
});

// @desc    Create a lecture (teacher)
// @route   POST /api/courses/:courseId/lectures
const createLecture = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { title, description, videoUrl, duration, isFree, resources } = req.body;

  const lastLecture = await Lecture.findOne({ course: req.params.courseId })
    .sort({ order: -1 })
    .select('order');

  const lecture = await Lecture.create({
    title,
    description,
    course: req.params.courseId,
    videoUrl,
    duration,
    isFree: isFree || false,
    order: lastLecture ? lastLecture.order + 1 : 0,
    resources: resources || [],
  });

  // Add lecture to course
  course.lectures.push(lecture._id);
  await course.save();

  res.status(201).json(lecture);
});

// @desc    Update a lecture (teacher)
// @route   PUT /api/lectures/:id
const updateLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id).populate('course');

  if (!lecture) {
    res.status(404);
    throw new Error('Lecture not found');
  }

  if (lecture.course.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const updatedLecture = await Lecture.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedLecture);
});

// @desc    Delete a lecture (teacher)
// @route   DELETE /api/lectures/:id
const deleteLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id).populate('course');

  if (!lecture) {
    res.status(404);
    throw new Error('Lecture not found');
  }

  if (lecture.course.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Remove from course
  await Course.findByIdAndUpdate(lecture.course._id, {
    $pull: { lectures: req.params.id },
  });

  await Lecture.findByIdAndDelete(req.params.id);

  res.json({ message: 'Lecture deleted successfully' });
});

// @desc    Mark lecture as completed (student)
// @route   POST /api/lectures/:id/complete
const completeLecture = asyncHandler(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  if (!lecture) {
    res.status(404);
    throw new Error('Lecture not found');
  }

  const user = await User.findById(req.user._id);

  const enrolledCourse = user.enrolledCourses.find(
    (ec) => ec.course.toString() === lecture.course.toString()
  );

  if (!enrolledCourse) {
    res.status(400);
    throw new Error('Not enrolled in this course');
  }

  if (!enrolledCourse.completedLectures.some((id) => id.toString() === lecture._id.toString())) {
    enrolledCourse.completedLectures.push(lecture._id);

    // Calculate progress
    const totalLectures = await Lecture.countDocuments({
      course: lecture.course,
    });
    enrolledCourse.progress = Math.round(
      (enrolledCourse.completedLectures.length / totalLectures) * 100
    );

    await user.save();
  }

  res.json({ progress: enrolledCourse.progress });
});

module.exports = {
  getLectures,
  createLecture,
  updateLecture,
  deleteLecture,
  completeLecture,
};

