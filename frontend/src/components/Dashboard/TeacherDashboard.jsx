import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTeacherCourses, deleteCourse } from '../../redux/courseSlice';
import { FiBookOpen, FiUsers, FiPlusCircle, FiTrendingUp, FiDollarSign, FiEdit, FiTrash2 } from 'react-icons/fi';

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { teacherCourses, loading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchTeacherCourses());
  }, [dispatch]);

  const totalStudents = teacherCourses.reduce(
    (sum, course) => sum + (course.enrolledStudents?.length || 0),
    0
  );

  const handleDelete = (course) => {
    if (window.confirm(`Delete "${course.title}"?`)) {
      dispatch(deleteCourse(course._id));
    }
  };

  const stats = [
    { label: 'My Courses', value: teacherCourses.length, icon: FiBookOpen, color: 'bg-blue-500' },
    { label: 'Total Students', value: totalStudents, icon: FiUsers, color: 'bg-green-500' },
    { label: 'Total Lectures', value: teacherCourses.reduce((s, c) => s + (c.lectures?.length || 0), 0), icon: FiTrendingUp, color: 'bg-purple-500' },
    { label: 'Revenue', value: `$${teacherCourses.reduce((s, c) => s + (c.price || 0), 0)}`, icon: FiDollarSign, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Instructor Dashboard 👨‍🏫</h1>
            <p className="text-primary-100">Manage your courses and students</p>
          </div>
          <Link to="/teacher/courses/create" className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
            + New Course
          </Link>
        </div>
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

      {/* Course Management */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-dark-900">My Courses</h2>
          <Link to="/teacher/courses/create" className="btn-primary flex items-center space-x-2 text-sm">
            <FiPlusCircle className="h-4 w-4" />
            <span>Create Course</span>
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 skeleton rounded-lg" />
            ))}
          </div>
        ) : teacherCourses.length === 0 ? (
          <div className="text-center py-8">
            <FiBookOpen className="h-12 w-12 text-dark-300 mx-auto mb-3" />
            <p className="text-dark-500 mb-4">You haven't created any courses yet</p>
            <Link to="/teacher/courses/create" className="btn-primary">Create Your First Course</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {teacherCourses.map((course) => (
              <div key={course._id} className="flex items-center justify-between p-4 bg-dark-50 rounded-lg hover:bg-primary-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
                    <FiBookOpen className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark-900">{course.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-dark-500 mt-1">
                      <span>{course.lectures?.length || 0} lectures</span>
                      <span>{course.enrolledStudents?.length || 0} students</span>
                      <span className="badge-primary">{course.category}</span>
                      {course.published ? (
                        <span className="badge-success">Published</span>
                      ) : (
                        <span className="badge-warning">Draft</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-dark-900">${course.price}</span>
                  <Link to={`/courses/${course._id}`} className="btn-secondary p-2" title="View">
                    <FiEdit className="h-4 w-4" />
                  </Link>
                  <button onClick={() => handleDelete(course)} className="btn-danger p-2" title="Delete">
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;

