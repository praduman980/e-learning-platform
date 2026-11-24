import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiDownload, FiAward, FiExternalLink, FiShield } from 'react-icons/fi';

const CertificateView = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data } = await API.get('/certificate/my');
      setCertificates(data);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (certId) => {
    try {
      const response = await API.get(`/certificate/${certId}/download`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificate-${certId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleVerify = (certificateId) => {
    window.open(`http://127.0.0.1:5000/api/certificate/verify/${certificateId}`, '_blank');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">My Certificates</h1>
          <p className="text-dark-500">Download and verify your course completion certificates</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="text-center py-16">
          <FiAward className="h-16 w-16 text-dark-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-700 mb-2">No Certificates Yet</h3>
          <p className="text-dark-500">Complete a course to earn your certificate</p>
        </div>
      ) : (
        <div className="space-y-4">
          {certificates.map((cert) => (
            <div key={cert._id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                    <FiAward className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900">{cert.courseName}</h3>
                    <p className="text-sm text-dark-500">{cert.studentName}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="badge-success text-xs">Grade: {cert.grade}</span>
                      <span className="text-xs text-dark-400">
                        Issued: {new Date(cert.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-dark-400 mt-1">ID: {cert.certificateId}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-dark-200">
                <button
                  onClick={() => handleDownload(cert._id)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiDownload className="h-4 w-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => handleVerify(cert.certificateId)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FiShield className="h-4 w-4" />
                  <span>Verify</span>
                </button>
                {cert.pdfUrl && (
                  <a
                    href={cert.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <FiExternalLink className="h-4 w-4" />
                    <span>View Online</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificateView;

