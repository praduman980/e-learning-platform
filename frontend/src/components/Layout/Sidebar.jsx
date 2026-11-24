import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiHome,
  FiBookOpen,
  FiCode,
  FiCpu,
  FiAward,
  FiBarChart2,
  FiUsers,
  FiPlusCircle,
} from 'react-icons/fi';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const studentLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Overview' },
    { to: '/courses', icon: FiBookOpen, label: 'My Courses' },
    { to: '/compiler', icon: FiCode, label: 'Code Compiler' },
    { to: '/ai-assistant', icon: FiCpu, label: 'AI Assistant' },
    { to: '/certificates', icon: FiAward, label: 'Certificates' },
  ];

  const teacherLinks = [
    { to: '/dashboard', icon: FiHome, label: 'Overview' },
    { to: '/teacher/courses', icon: FiBookOpen, label: 'My Courses' },
    { to: '/teacher/courses/create', icon: FiPlusCircle, label: 'Create Course' },
    { to: '/compiler', icon: FiCode, label: 'Code Compiler' },
    { to: '/ai-assistant', icon: FiCpu, label: 'AI Assistant' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r border-dark-200 min-h-screen hidden lg:block">
      <div className="p-4">
        <div className="mb-6 p-4 bg-primary-50 rounded-xl">
          <p className="text-sm text-dark-500">Welcome back,</p>
          <p className="font-semibold text-dark-900">{user?.name}</p>
          <span className="inline-block mt-1 badge-primary text-xs capitalize">{user?.role}</span>
        </div>

        <nav className="space-y-1">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(link.to)
                  ? 'bg-primary-50 text-primary-700 font-medium'
                  : 'text-dark-600 hover:bg-dark-50 hover:text-dark-900'
              }`}
            >
              <link.icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;

