const asyncHandler = require('express-async-handler');
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Get quiz for a course
// @route   GET /api/courses/:courseId/quiz
const getQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findOne({ course: req.params.courseId });

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found for this course');
  }

  // Return quiz without correct answers if not teacher
  if (req.user.role !== 'teacher') {
    const safeQuiz = {
      ...quiz.toObject(),
      questions: quiz.questions.map((q) => ({
        _id: q._id,
        question: q.question,
        options: q.options,
        explanation: q.explanation,
      })),
    };
    return res.json(safeQuiz);
  }

  res.json(quiz);
});

// @desc    Create quiz (teacher)
// @route   POST /api/courses/:courseId/quiz
const createQuiz = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  if (course.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { title, description, questions, passingScore, timeLimit } = req.body;

  const quiz = await Quiz.create({
    title,
    description,
    course: req.params.courseId,
    questions,
    passingScore: passingScore || 60,
    timeLimit: timeLimit || 30,
  });

  course.quizzes.push(quiz._id);
  await course.save();

  res.status(201).json(quiz);
});

// @desc    Submit quiz answers (student)
// @route   POST /api/quiz/:id/submit
const submitQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  const { answers } = req.body;

  if (!answers || !Array.isArray(answers)) {
    res.status(400);
    throw new Error('Answers are required');
  }

  let score = 0;
  const results = [];

  quiz.questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === question.correctAnswer;

    if (isCorrect) score++;

    results.push({
      questionId: question._id,
      question: question.question,
      userAnswer: userAnswer ?? -1,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
    });
  });

  const total = quiz.questions.length;
  const percentage = Math.round((score / total) * 100);
  const passed = percentage >= quiz.passingScore;

  // Save result to user
  const user = await User.findById(req.user._id);
  user.quizResults.push({
    quiz: quiz._id,
    score: percentage,
    total: 100,
  });
  await user.save();

  res.json({
    score: percentage,
    total: 100,
    correctAnswers: score,
    totalQuestions: total,
    passed,
    results,
  });
});

// @desc    Update quiz (teacher)
// @route   PUT /api/quiz/:id
const updateQuiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).populate('course');

  if (!quiz) {
    res.status(404);
    throw new Error('Quiz not found');
  }

  if (quiz.course.teacher.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const updatedQuiz = await Quiz.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  res.json(updatedQuiz);
});

module.exports = {
  getQuiz,
  createQuiz,
  submitQuiz,
  updateQuiz,
};

