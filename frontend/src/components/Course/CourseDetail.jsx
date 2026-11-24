import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourseById, enrollCourse } from '../../redux/courseSlice';
import { fetchQuiz, clearQuiz } from '../../redux/quizSlice';
import ReactPlayer from 'react-player';
import {
  FiPlay,
  FiCheckCircle,
  FiClock,
  FiUsers,
  FiStar,
  FiAward,
  FiBookOpen,
  FiDollarSign,
} from 'react-icons/fi';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentCourse, loading } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);
  const [selectedLecture, setSelectedLecture] = useState(null);

  useEffect(() => {
    dispatch(fetchCourseById(id));
    dispatch(clearQuiz());
  }, [dispatch, id]);

  const handleEnroll = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (currentCourse.course.isFree) {
      dispatch(enrollCourse(id)).then(() => {
        dispatch(fetchCourseById(id));
      });
    } else {
      navigate(`/payment/${id}`);
    }
  };

  const handleLectureClick = (lecture) => {
    setSelectedLecture(lecture);
  };

  if (loading || !currentCourse) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-64 skeleton rounded-xl" />
          <div className="h-8 skeleton w-1/2" />
          <div className="h-4 skeleton w-3/4" />
        </div>
      </div>
    );
  }

  const { course, isEnrolled } = currentCourse;

  return (
    <div className="min-h-screen bg-dark-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="badge bg-white/20 text-white mb-4 inline-block">{course.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-primary-100 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-6 text-sm text-primary-100">
                <div className="flex items-center space-x-2">
                  <FiClock className="h-4 w-4" />
                  <span>{course.totalDuration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="h-4 w-4" />
                  <span>{course.enrolledStudents?.length || 0} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiStar className="h-4 w-4 text-yellow-400" />
                  <span>{course.rating?.toFixed(1) || '0.0'} ({course.totalRatings} ratings)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiBookOpen className="h-4 w-4" />
                  <span>{course.lectures?.length || 0} lectures</span>
                </div>
              </div>

              <div className="flex items-center mt-6 space-x-2">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="font-semibold">{course.teacher?.name?.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{course.teacher?.name}</p>
                  <p className="text-sm text-primary-200">Course Instructor</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 text-dark-900">
              <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                <FiPlay className="h-16 w-16 text-primary-600" />
              </div>
              <h3 className="text-3xl font-bold mb-4">
                {course.isFree ? 'Free' : `$${course.price}`}
              </h3>
              <button
                onClick={handleEnroll}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  isEnrolled
                    ? 'bg-green-500 text-white cursor-default'
                    : 'btn-primary w-full'
                }`}
                disabled={isEnrolled}
              >
                {isEnrolled ? '✓ Enrolled' : course.isFree ? 'Enroll Free' : 'Enroll Now'}
              </button>
              {!isEnrolled && (
                <p className="text-sm text-dark-500 mt-2 text-center">30-day money-back guarantee</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            {course.whatYouWillLearn?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dark-900 mb-4">What you'll learn</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, i) => (
                    <div key={i} className="flex items-start space-x-2">
                      <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-dark-700 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {course.requirements?.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-dark-900 mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-primary-600 font-bold">•</span>
                      <span className="text-dark-700 text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content / Lectures */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-dark-900 mb-4">Course Content</h2>
              <div className="space-y-2">
                {course.lectures?.map((lecture, index) => (
                  <div
                    key={lecture._id}
                    onClick={() => isEnrolled && handleLectureClick(lecture)}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      isEnrolled
                        ? 'hover:bg-dark-50 cursor-pointer'
                        : ''
                    } ${
                      selectedLecture?._id === lecture._id ? 'bg-primary-50 border border-primary-200' : 'bg-dark-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-dark-900">{lecture.title}</p>
                        <p className="text-sm text-dark-500">{lecture.duration}</p>
                      </div>
                    </div>
                    {lecture.isFree && (
                      <span className="badge-success text-xs">Free</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Video Player */}
            {selectedLecture && (
              <div className="card overflow-hidden">
                <div className="aspect-video bg-dark-900">
                  {selectedLecture.videoUrl ? (
                    <ReactPlayer
                      url={selectedLecture.videoUrl}
                      width="100%"
                      height="100%"
                      controls
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiPlay className="h-20 w-20 text-dark-600" />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-dark-900">{selectedLecture.title}</h3>
                  <p className="text-dark-600 mt-2">{selectedLecture.description}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Features */}
            <div className="card p-6">
              <h3 className="font-semibold text-dark-900 mb-4">This course includes:</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3 text-sm text-dark-600">
                  <FiPlay className="h-4 w-4 text-primary-600" />
                  <span>{course.lectures?.length || 0} on-demand videos</span>
                </li>
                <li className="flex items-center space-x-3 text-sm text-dark-600">
                  <FiAward className="h-4 w-4 text-primary-600" />
                  <span>Certificate of completion</span>
                </li>
                <li className="flex items-center space-x-3 text-sm text-dark-600">
                  <FiClock className="h-4 w-4 text-primary-600" />
                  <span>Full lifetime access</span>
                </li>
                <li className="flex items-center space-x-3 text-sm text-dark-600">
                  <FiUsers className="h-4 w-4 text-primary-600" />
                  <span>Community discussion</span>
                </li>
              </ul>
            </div>

            {/* Quiz Section */}
            {course.quizzes?.length > 0 && isEnrolled && (
              <div className="card p-6">
                <h3 className="font-semibold text-dark-900 mb-4">Course Quiz</h3>
                <p className="text-sm text-dark-500 mb-4">Test your knowledge after completing the course</p>
                <button
                  onClick={() => navigate(`/quiz/${course._id}`)}
                  className="btn-primary w-full"
                >
                  Start Quiz
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

