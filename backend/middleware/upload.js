const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = {
  _handleFile(req, file, callback) {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'elearning',
        resource_type: 'auto',
        allowed_formats: [
          'jpg',
          'jpeg',
          'png',
          'gif',
          'mp4',
          'webm',
          'pdf',
          'doc',
          'docx',
        ],
        transformation: [{ width: 1280, height: 720, crop: 'limit' }],
      },
      (error, result) => {
        if (error) return callback(error);
        callback(null, {
          path: result.secure_url,
          size: result.bytes,
          filename: result.public_id,
        });
      }
    );

    file.stream.pipe(stream);
  },
  _removeFile(req, file, callback) {
    cloudinary.uploader.destroy(file.filename, { invalidate: true }, callback);
  },
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Not supported file type'), false);
    }
  },
});

module.exports = upload;

