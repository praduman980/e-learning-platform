import { Link } from 'react-router-dom';
import { FiBookOpen, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-dark-900 text-dark-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <FiBookOpen className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">LearnHub</span>
            </Link>
            <p className="text-dark-400 mb-4 max-w-md">
              Empowering learners worldwide with quality education. Access expert-led courses,
              interactive quizzes, and AI-powered learning assistance.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-dark-400">
                <FiMail className="h-4 w-4" />
                <span className="text-sm">support@learnhub.com</span>
              </div>
              <div className="flex items-center space-x-2 text-dark-400">
                <FiPhone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="hover:text-primary-400 transition-colors text-sm">
                  Browse Courses
                </Link>
              </li>
              <li>
                <Link to="/compiler" className="hover:text-primary-400 transition-colors text-sm">
                  Code Compiler
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-primary-400 transition-colors text-sm">
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary-400 transition-colors text-sm">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/courses?category=Web%20Development" className="hover:text-primary-400 transition-colors text-sm">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Data%20Science" className="hover:text-primary-400 transition-colors text-sm">
                  Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=AI%20%26%20Machine%20Learning" className="hover:text-primary-400 transition-colors text-sm">
                  AI & Machine Learning
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Mobile%20Development" className="hover:text-primary-400 transition-colors text-sm">
                  Mobile Development
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-dark-400">
            &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-dark-400 hover:text-primary-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

