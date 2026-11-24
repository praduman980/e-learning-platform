const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
  },
  options: [
    {
      type: String,
      required: [true, 'Options are required'],
    },
  ],
  correctAnswer: {
    type: Number,
    required: [true, 'Correct answer index is required'],
  },
  explanation: {
    type: String,
    default: '',
  },
});

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Quiz title is required'],
    },
    description: {
      type: String,
      default: '',
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lecture',
    },
    questions: [questionSchema],
    passingScore: {
      type: Number,
      default: 60,
    },
    timeLimit: {
      type: Number,
      default: 30,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Quiz', quizSchema);

