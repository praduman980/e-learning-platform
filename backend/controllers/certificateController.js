const asyncHandler = require('express-async-handler');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const User = require('../models/User');
const generateCertificatePDF = require('../utils/certificateTemplate');
const cloudinary = require('../config/cloudinary');
const crypto = require('crypto');

// @desc    Generate certificate for completed course
// @route   POST /api/certificate/generate
const generateCertificate = asyncHandler(async (req, res) => {
  const { courseId, grade } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  // Check if enrolled and completed
  const user = await User.findById(req.user._id);
  const enrolledCourse = user.enrolledCourses.find(
    (ec) => ec.course.toString() === courseId
  );

  if (!enrolledCourse) {
    res.status(400);
    throw new Error('Not enrolled in this course');
  }

  if (enrolledCourse.progress < 100) {
    res.status(400);
    throw new Error('Course not completed yet');
  }

  // Check if certificate already exists
  const existingCert = await Certificate.findOne({
    user: req.user._id,
    course: courseId,
  });

  if (existingCert) {
    return res.json(existingCert);
  }

  // Generate unique certificate ID
  const certificateId = `CERT-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

  // Generate PDF
  const pdfBuffer = await generateCertificatePDF({
    studentName: user.name,
    courseName: course.title,
    certificateId,
    completionDate: new Date(),
    grade: grade || 'A',
  });

  // Upload to cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'certificates',
        resource_type: 'raw',
        public_id: certificateId,
        format: 'pdf',
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(pdfBuffer);
  });

  // Save certificate
  const certificate = await Certificate.create({
    user: req.user._id,
    course: courseId,
    certificateId,
    studentName: user.name,
    courseName: course.title,
    grade: grade || 'A',
    pdfUrl: uploadResult.secure_url,
    isVerified: true,
  });

  // Add certificate to user
  user.certificates.push(certificate._id);
  await user.save();

  res.status(201).json(certificate);
});

// @desc    Get user's certificates
// @route   GET /api/certificate/my
const getMyCertificates = asyncHandler(async (req, res) => {
  const certificates = await Certificate.find({ user: req.user._id })
    .populate('course', 'title thumbnail')
    .sort({ createdAt: -1 });

  res.json(certificates);
});

// @desc    Verify certificate
// @route   GET /api/certificate/verify/:certificateId
const verifyCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({
    certificateId: req.params.certificateId,
  })
    .populate('user', 'name email')
    .populate('course', 'title');

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  res.json({
    isValid: true,
    studentName: certificate.studentName,
    courseName: certificate.courseName,
    issueDate: certificate.completionDate,
    grade: certificate.grade,
  });
});

// @desc    Download certificate
// @route   GET /api/certificate/:id/download
const downloadCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findById(req.params.id);

  if (!certificate) {
    res.status(404);
    throw new Error('Certificate not found');
  }

  if (
    certificate.user.toString() !== req.user._id.toString() &&
    req.user.role !== 'admin'
  ) {
    res.status(403);
    throw new Error('Not authorized');
  }

  // Generate new PDF for download
  const pdfBuffer = await generateCertificatePDF({
    studentName: certificate.studentName,
    courseName: certificate.courseName,
    certificateId: certificate.certificateId,
    completionDate: certificate.completionDate,
    grade: certificate.grade,
  });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader(
    'Content-Disposition',
    `attachment; filename=certificate-${certificate.certificateId}.pdf`
  );
  res.send(pdfBuffer);
});

module.exports = {
  generateCertificate,
  getMyCertificates,
  verifyCertificate,
  downloadCertificate,
};

