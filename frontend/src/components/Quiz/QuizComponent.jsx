import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuiz, submitQuiz, clearQuiz } from '../../redux/quizSlice';
import { FiClock, FiCheckCircle, FiXCircle, FiAward } from 'react-icons/fi';

const QuizComponent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentQuiz, quizResult, loading } = useSelector((state) => state.quiz);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchQuiz(courseId));
    }
    return () => dispatch(clearQuiz());
  }, [dispatch, courseId]);

  useEffect(() => {
    if (currentQuiz?.timeLimit) {
      setTimeLeft(currentQuiz.timeLimit * 60);
    }
  }, [currentQuiz]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    const answersArray = currentQuiz.questions.map((_, i) => answers[i] ?? -1);
    dispatch(submitQuiz({ quizId: currentQuiz._id, answers: answersArray }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 skeleton w-1/3" />
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  if (!currentQuiz) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <FiAward className="h-16 w-16 text-dark-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-dark-700 mb-2">No Quiz Available</h2>
        <p className="text-dark-500">This course doesn't have a quiz yet.</p>
        <button onClick={() => navigate(-1)} className="btn-primary mt-6">Go Back</button>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="card p-8 text-center">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 ${
            quizResult.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {quizResult.passed ? (
              <FiAward className="h-10 w-10 text-green-600" />
            ) : (
              <FiXCircle className="h-10 w-10 text-red-600" />
            )}
          </div>
          <h2 className="text-2xl font-bold text-dark-900 mb-2">
            {quizResult.passed ? 'Congratulations!' : 'Better luck next time!'}
          </h2>
          <p className="text-dark-500 mb-6">
            {quizResult.passed ? 'You passed the quiz!' : 'You did not pass this quiz.'}
          </p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-dark-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-dark-900">{quizResult.score}%</p>
              <p className="text-sm text-dark-500">Your Score</p>
            </div>
            <div className="bg-dark-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-dark-900">{quizResult.correctAnswers}/{quizResult.totalQuestions}</p>
              <p className="text-sm text-dark-500">Correct</p>
            </div>
            <div className="bg-dark-50 rounded-lg p-4">
              <p className="text-2xl font-bold text-dark-900">{quizResult.passed ? 'Passed' : 'Failed'}</p>
              <p className="text-sm text-dark-500">Status</p>
            </div>
          </div>
          
          {/* Detailed Results */}
          <div className="text-left space-y-3 mb-6">
            {quizResult.results?.map((result, i) => (
              <div key={i} className={`p-4 rounded-lg ${result.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-start space-x-2">
                  {result.isCorrect ? (
                    <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <FiXCircle className="h-5 w-5 text-red-500 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-dark-900">{result.question}</p>
                    {!result.isCorrect && result.explanation && (
                      <p className="text-sm text-dark-500 mt-1">{result.explanation}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => navigate(`/courses/${courseId}`)} className="btn-primary">
            Back to Course
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">{currentQuiz.title}</h1>
          <p className="text-dark-500">{currentQuiz.description}</p>
        </div>
        {timeLeft !== null && (
          <div className="flex items-center space-x-2 bg-primary-50 px-4 py-2 rounded-lg">
            <FiClock className="h-5 w-5 text-primary-600" />
            <span className={`font-bold text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-primary-600'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-dark-200 rounded-full h-2 mb-6">
        <div
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((Object.keys(answers).length) / currentQuiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <span className="badge-primary">
            Question {currentQuestion + 1} of {currentQuiz.questions.length}
          </span>
          <span className="text-sm text-dark-500">
            {Object.keys(answers).length} answered
          </span>
        </div>

        <h3 className="text-lg font-semibold text-dark-900 mb-6">
          {currentQuiz.questions[currentQuestion]?.question}
        </h3>

        <div className="space-y-3">
          {currentQuiz.questions[currentQuestion]?.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(currentQuestion, index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                answers[currentQuestion] === index
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-dark-200 hover:border-dark-300'
              }`}
            >
              <span className="font-medium">{String.fromCharCode(65 + index)}.</span> {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="btn-secondary"
        >
          Previous
        </button>

        <div className="flex space-x-2">
          {currentQuiz.questions.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuestion(i)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                currentQuestion === i
                  ? 'bg-primary-600 text-white'
                  : answers[i] !== undefined
                  ? 'bg-green-100 text-green-700'
                  : 'bg-dark-100 text-dark-600'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {currentQuestion === currentQuiz.questions.length - 1 ? (
          <button onClick={handleSubmit} className="btn-primary">
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion((prev) => Math.min(currentQuiz.questions.length - 1, prev + 1))}
            className="btn-primary"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizComponent;

