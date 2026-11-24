const mongoose = require('mongoose');

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Lecture title is required'],
      trim: true,
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
    videoUrl: {
      type: String,
      default: '',
    },
    videoPublicId: {
      type: String,
      default: '',
    },
    duration: {
      type: String,
      default: '0:00',
    },
    order: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    resources: [
      {
        title: String,
        url: String,
        type: {
          type: String,
          enum: ['pdf', 'link', 'file'],
          default: 'link',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lecture', lectureSchema);

