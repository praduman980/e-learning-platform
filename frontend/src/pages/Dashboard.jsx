import { useSelector } from 'react-redux';
import StudentDashboard from '../components/Dashboard/StudentDashboard';
import TeacherDashboard from '../components/Dashboard/TeacherDashboard';
import Sidebar from '../components/Layout/Sidebar';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex min-h-screen bg-dark-50">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-8">
        {user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
      </div>
    </div>
  );
};

export default Dashboard;

