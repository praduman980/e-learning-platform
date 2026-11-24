import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { FiMenu, FiX, FiBookOpen, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-dark-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <FiBookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-dark-900">LearnHub</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-6">
              <Link to="/courses" className="text-dark-600 hover:text-primary-600 font-medium transition-colors">
                Courses
              </Link>
              <Link to="/compiler" className="text-dark-600 hover:text-primary-600 font-medium transition-colors">
                Compiler
              </Link>
              <Link to="/ai-assistant" className="text-dark-600 hover:text-primary-600 font-medium transition-colors">
                AI Assistant
              </Link>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 text-dark-700 hover:text-primary-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden md:block font-medium">{user.name}</span>
                  <FiChevronDown className="h-4 w-4" />
                </button>

                {showDropdown && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-dark-200 py-2 z-20 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-dark-200">
                        <p className="text-sm font-medium text-dark-900">{user.name}</p>
                        <p className="text-xs text-dark-500">{user.email}</p>
                        <span className="inline-block mt-1 badge-primary text-xs capitalize">{user.role}</span>
                      </div>
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2.5 text-dark-700 hover:bg-dark-50 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <FiUser className="h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2.5 text-red-600 hover:bg-red-50 w-full transition-colors"
                      >
                        <FiLogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary text-sm">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-dark-600 hover:text-dark-900"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-dark-200 animate-fadeIn">
          <div className="px-4 py-3 space-y-3">
            <Link to="/courses" className="block text-dark-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Courses
            </Link>
            <Link to="/compiler" className="block text-dark-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              Compiler
            </Link>
            <Link to="/ai-assistant" className="block text-dark-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
              AI Assistant
            </Link>
            {user && (
              <Link to="/dashboard" className="block text-dark-600 hover:text-primary-600 font-medium py-2" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

