import { Link } from 'react-router-dom';
import {
  FiBookOpen,
  FiCode,
  FiCpu,
  FiAward,
  FiPlay,
  FiStar,
  FiShield,
  FiArrowRight,
} from 'react-icons/fi';

const Home = () => {
  const features = [
    {
      icon: FiBookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with structured curriculum',
      color: 'bg-blue-500',
    },
    {
      icon: FiCode,
      title: 'Code Compiler',
      description: 'Write and run code in 20+ programming languages',
      color: 'bg-green-500',
    },
    {
      icon: FiCpu,
      title: 'AI Doubt Solver',
      description: 'Get instant help from our AI-powered learning assistant',
      color: 'bg-purple-500',
    },
    {
      icon: FiAward,
      title: 'Certificates',
      description: 'Earn verified certificates for your completed courses',
      color: 'bg-orange-500',
    },
  ];

  const categories = [
    { name: 'Web Development', icon: '🌐', courses: '24+ courses' },
    { name: 'Data Science', icon: '📊', courses: '18+ courses' },
    { name: 'AI & ML', icon: '🤖', courses: '12+ courses' },
    { name: 'Mobile Dev', icon: '📱', courses: '15+ courses' },
    { name: 'DevOps', icon: '⚙️', courses: '10+ courses' },
    { name: 'Cybersecurity', icon: '🔒', courses: '8+ courses' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fadeIn">
              <span className="badge bg-white/20 text-white mb-4 inline-block">
                🎉 Launch Sale - 50% OFF
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Learn Without
                <span className="text-primary-300"> Limits</span>
              </h1>
              <p className="text-lg text-primary-100 mb-8 max-w-xl">
                Master in-demand skills with expert-led courses, interactive coding,
                AI-powered assistance, and earn recognized certificates.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-all flex items-center justify-center space-x-2">
                  <span>Get Started Free</span>
                  <FiArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/courses" className="border-2 border-white/30 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all text-center">
                  Browse Courses
                </Link>
              </div>
              <div className="flex items-center space-x-6 mt-8 text-sm text-primary-200">
                <div className="flex items-center space-x-2">
                  <FiPlay className="h-4 w-4" />
                  <span>100+ Video Courses</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiStar className="h-4 w-4" />
                  <span>4.8 Avg Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiShield className="h-4 w-4" />
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <FiBookOpen className="h-24 w-24 text-white/50 mx-auto mb-4" />
                    <p className="text-2xl font-bold">Learn Anytime, Anywhere</p>
                  </div>
                </div>
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white text-dark-900 p-4 rounded-xl shadow-lg">
                  <p className="font-bold">10,000+</p>
                  <p className="text-sm text-dark-500">Students</p>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-dark-900 p-4 rounded-xl shadow-lg">
                  <p className="font-bold">50+</p>
                  <p className="text-sm text-dark-500">Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-dark-500 max-w-2xl mx-auto">
              Comprehensive learning platform with all the tools you need to master new skills
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="card p-6 text-center hover:-translate-y-1 transition-transform">
                <div className={`w-16 h-16 ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-dark-900 mb-2">{feature.title}</h3>
                <p className="text-dark-500 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-dark-900 mb-4">
              Explore Categories
            </h2>
            <p className="text-dark-500 max-w-2xl mx-auto">
              Choose from a wide range of categories and start learning today
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={i}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="card p-6 text-center hover:-translate-y-1 transition-transform"
              >
                <span className="text-4xl block mb-3">{cat.icon}</span>
                <h3 className="font-semibold text-dark-900 text-sm">{cat.name}</h3>
                <p className="text-xs text-dark-500 mt-1">{cat.courses}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and start your learning journey today.
            Get access to all courses with a single subscription.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-700 px-10 py-4 rounded-lg font-semibold text-lg hover:bg-primary-50 transition-all inline-flex items-center space-x-2"
          >
            <span>Get Started Free</span>
            <FiArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-t border-dark-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: '10,000+', label: 'Students' },
              { number: '100+', label: 'Courses' },
              { number: '50+', label: 'Instructors' },
              { number: '95%', label: 'Satisfaction' },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-primary-600">{stat.number}</p>
                <p className="text-dark-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

