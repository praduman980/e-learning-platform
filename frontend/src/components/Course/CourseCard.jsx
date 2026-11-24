import { Link } from 'react-router-dom';
import { FiClock, FiUsers, FiStar, FiBookOpen } from 'react-icons/fi';

const CourseCard = ({ course }) => {
  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner': return 'badge-success';
      case 'Intermediate': return 'badge-warning';
      case 'Advanced': return 'badge-danger';
      default: return 'badge-primary';
    }
  };

  return (
    <Link to={`/courses/${course._id}`} className="card overflow-hidden group">
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FiBookOpen className="h-16 w-16 text-white/50" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className={getLevelColor(course.level)}>{course.level}</span>
        </div>
        {course.isFree && (
          <div className="absolute top-3 left-3 badge-success">Free</div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-dark-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>
        <p className="text-sm text-dark-500 mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Teacher */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 font-semibold text-xs">
              {course.teacher?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <span className="text-sm text-dark-600">{course.teacher?.name}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-dark-500 pt-4 border-t border-dark-200">
          <div className="flex items-center space-x-1">
            <FiClock className="h-4 w-4" />
            <span>{course.totalDuration}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiUsers className="h-4 w-4" />
            <span>{course.enrolledStudents?.length || 0} students</span>
          </div>
          <div className="flex items-center space-x-1">
            <FiStar className="h-4 w-4 text-yellow-500" />
            <span>{course.rating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mt-4">
          {course.isFree ? (
            <span className="badge-success text-sm font-semibold">Free</span>
          ) : (
            <span className="text-xl font-bold text-dark-900">${course.price}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;

