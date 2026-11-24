const PDFDocument = require('pdfkit');

const generateCertificatePDF = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        layout: 'landscape',
        size: 'A4',
      });

      const buffers = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));

      // Border
      doc.rect(30, 20, 732, 560).lineWidth(4).stroke('#2563eb');
      doc.rect(35, 25, 722, 550).lineWidth(1.5).stroke('#93c5fd');

      // Header
      doc
        .fontSize(14)
        .fillColor('#2563eb')
        .text('CERTIFICATE OF COMPLETION', 0, 80, { align: 'center' });

      // Title
      doc
        .moveDown(2)
        .fontSize(36)
        .fillColor('#1e293b')
        .text('Certificate of Achievement', { align: 'center' });

      // Subtitle
      doc
        .moveDown(1)
        .fontSize(16)
        .fillColor('#475569')
        .text('This is to certify that', { align: 'center' });

      // Student Name
      doc
        .moveDown(1)
        .fontSize(32)
        .fillColor('#2563eb')
        .text(data.studentName, { align: 'center' });

      // Course Completion Text
      doc
        .moveDown(1)
        .fontSize(16)
        .fillColor('#475569')
        .text('has successfully completed the course', { align: 'center' });

      // Course Name
      doc
        .moveDown(1)
        .fontSize(24)
        .fillColor('#1e293b')
        .text(data.courseName, { align: 'center' });

      // Details
      doc
        .moveDown(2)
        .fontSize(12)
        .fillColor('#64748b')
        .text(`Certificate ID: ${data.certificateId}`, { align: 'center' })
        .moveDown(0.5)
        .text(
          `Date of Completion: ${new Date(data.completionDate).toLocaleDateString()}`,
          { align: 'center' }
        )
        .moveDown(0.5)
        .text(`Grade: ${data.grade}`, { align: 'center' });

      // Footer
      doc
        .moveDown(4)
        .fontSize(10)
        .fillColor('#94a3b8')
        .text('This certificate is issued by the E-Learning Platform', {
          align: 'center',
        });

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificatePDF;

