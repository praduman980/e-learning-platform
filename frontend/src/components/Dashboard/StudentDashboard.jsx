import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProfile } from '../../redux/authSlice';
import { FiBookOpen, FiCode, FiAward, FiTrendingUp, FiClock, FiStar } from 'react-icons/fi';

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [stats] = useState([
    { label: 'Enrolled Courses', value: user?.enrolledCourses?.length || 0, icon: FiBookOpen, color: 'bg-blue-500' },
    { label: 'Certificates', value: user?.certificates?.length || 0, icon: FiAward, color: 'bg-green-500' },
    { label: 'Quizzes Taken', value: user?.quizResults?.length || 0, icon: FiTrendingUp, color: 'bg-purple-500' },
    { label: 'Code Compilations', value: '-', icon: FiCode, color: 'bg-orange-500' },
  ]);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}! 👋</h1>
        <p className="text-primary-100">Continue your learning journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="card p-4 flex items-center space-x-4">
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark-900">{stat.value}</p>
              <p className="text-sm text-dark-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enrolled Courses */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-900">My Courses</h2>
          <Link to="/courses" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            Browse More
          </Link>
        </div>
        {user?.enrolledCourses?.length > 0 ? (
          <div className="space-y-4">
            {user.enrolledCourses.slice(0, 5).map((ec) => (
              <div key={ec._id} className="flex items-center justify-between p-4 bg-dark-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <FiBookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-dark-900">{ec.course?.title || 'Course'}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-dark-500">Progress: {ec.progress}%</span>
                      <div className="w-24 bg-dark-200 rounded-full h-2">
                        <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${ec.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <Link to={`/courses/${ec.course?._id}`} className="btn-secondary text-sm">
                  Continue
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FiBookOpen className="h-12 w-12 text-dark-300 mx-auto mb-3" />
            <p className="text-dark-500 mb-4">You haven't enrolled in any courses yet</p>
            <Link to="/courses" className="btn-primary">Browse Courses</Link>
          </div>
        )}
      </div>

      {/* Recent Quiz Results */}
      {user?.quizResults?.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-dark-900 mb-4">Recent Quiz Results</h2>
          <div className="space-y-3">
            {user.quizResults.slice(-3).reverse().map((qr, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-dark-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiStar className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm font-medium text-dark-900">Quiz #{i + 1}</p>
                    <p className="text-xs text-dark-500">{new Date(qr.submittedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className={`badge ${qr.score >= 60 ? 'badge-success' : 'badge-danger'}`}>
                  {qr.score}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

