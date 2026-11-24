import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses } from '../../redux/courseSlice';
import CourseCard from './CourseCard';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const categories = [
  'all',
  'Web Development',
  'Mobile Development',
  'Data Science',
  'AI & Machine Learning',
  'DevOps',
  'Cloud Computing',
  'Cybersecurity',
  'Programming Languages',
  'Database',
];

const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

const CourseList = () => {
  const dispatch = useDispatch();
  const { courses, loading, totalPages, currentPage } = useSelector((state) => state.courses);
  const [filters, setFilters] = useState({
    category: 'all',
    level: 'all',
    search: '',
  });

  useEffect(() => {
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchCourses({ ...filters, page: 1 }));
  };

  const handlePageChange = (page) => {
    dispatch(fetchCourses({ ...filters, page }));
  };

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-dark-200">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search courses..."
              className="input-field pl-10"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select
            className="input-field md:w-48"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <select
            className="input-field md:w-40"
            value={filters.level}
            onChange={(e) => setFilters({ ...filters, level: e.target.value })}
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl === 'all' ? 'All Levels' : lvl}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">
            <FiFilter className="h-4 w-4 mr-2 inline" />
            Search
          </button>
        </form>
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card p-0 overflow-hidden">
              <div className="h-48 skeleton" />
              <div className="p-5 space-y-3">
                <div className="h-5 skeleton w-3/4" />
                <div className="h-4 skeleton w-full" />
                <div className="h-4 skeleton w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-16">
          <FiSearch className="h-16 w-16 text-dark-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-dark-700 mb-2">No courses found</h3>
          <p className="text-dark-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn-secondary disabled:opacity-50"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary-600 text-white'
                      : 'bg-dark-100 text-dark-600 hover:bg-dark-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseList;

