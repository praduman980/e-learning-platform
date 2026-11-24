import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseView from './pages/CourseView';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import CompilerPage from './pages/CompilerPage';
import AIPage from './pages/AIPage';
import CertificatePage from './pages/CertificatePage';
import QuizPage from './pages/QuizPage';
import PaymentPage from './pages/PaymentPage';
import CreateCoursePage from './pages/CreateCoursePage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseView />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/compiler" element={<CompilerPage />} />
                <Route path="/ai-assistant" element={<AIPage />} />
                <Route path="/certificates" element={<CertificatePage />} />
                <Route path="/quiz/:courseId" element={<QuizPage />} />
                <Route path="/payment/:courseId" element={<PaymentPage />} />
              </Route>

              {/* Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={['teacher', 'admin']} />}>
                <Route path="/teacher/courses" element={<Dashboard />} />
                <Route path="/teacher/courses/create" element={<CreateCoursePage />} />
              </Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App;

