import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../../redux/authSlice';
import { FiBookOpen, FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-dark-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 animate-fadeIn">
        <div className="text-center mb-8">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <FiBookOpen className="h-10 w-10 text-primary-600" />
            <span className="text-2xl font-bold text-dark-900">LearnHub</span>
          </Link>
          <h1 className="text-2xl font-bold text-dark-900">Create Account</h1>
          <p className="text-dark-500 mt-1">Start your learning journey today</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 h-5 w-5" />
              <input
                type="text"
                required
                className="input-field pl-10"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 h-5 w-5" />
              <input
                type="email"
                required
                className="input-field pl-10"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 h-5 w-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className="input-field pl-10 pr-10"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600"
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1.5">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  formData.role === 'student'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-dark-300 text-dark-600 hover:border-dark-400'
                }`}
                onClick={() => setFormData({ ...formData, role: 'student' })}
              >
                <span className="block text-lg mb-1">📚</span>
                <span className="font-medium text-sm">Learn</span>
              </button>
              <button
                type="button"
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  formData.role === 'teacher'
                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                    : 'border-dark-300 text-dark-600 hover:border-dark-400'
                }`}
                onClick={() => setFormData({ ...formData, role: 'teacher' })}
              >
                <span className="block text-lg mb-1">👨‍🏫</span>
                <span className="font-medium text-sm">Teach</span>
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-dark-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

