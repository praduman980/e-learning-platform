import CourseList from '../components/Course/CourseList';

const Courses = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-dark-900">Explore Courses</h1>
        <p className="text-dark-500 mt-2">Discover courses that match your learning goals</p>
      </div>
      <CourseList />
    </div>
  );
};

export default Courses;

