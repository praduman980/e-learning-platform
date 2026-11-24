import { useState, useRef, useEffect } from 'react';
import API from '../../api/axios';
import { FiSend, FiCpu, FiUser, FiRefreshCw, FiBookOpen } from 'react-icons/fi';

const AIDoubtSolver = () => {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Hi! I'm your AI Learning Assistant. Ask me any questions about your courses, programming concepts, or anything you're struggling with. I'm here to help! 📚",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/ai/ask', {
        question: input,
        context,
      });

      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: data.answer },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          content: "I apologize, but I'm having trouble processing your request. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'ai',
        content: "Hi! I'm your AI Learning Assistant. Ask me any questions about your courses, programming concepts, or anything you're struggling with. I'm here to help! 📚",
      },
    ]);
    setContext('');
  };

  const quickQuestions = [
    'Explain how React hooks work',
    'What is the difference between REST and GraphQL?',
    'Help me understand asynchronous JavaScript',
    'Explain Python decorators with examples',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">AI Doubt Solver</h1>
          <p className="text-dark-500">Powered by AI - Get instant help with your learning</p>
        </div>
        <button onClick={handleClearChat} className="btn-secondary flex items-center space-x-2">
          <FiRefreshCw className="h-4 w-4" />
          <span>New Chat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-4">
            <h3 className="font-semibold text-dark-900 mb-3">Quick Questions</h3>
            <div className="space-y-2">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => setInput(q)}
                  className="w-full text-left p-3 rounded-lg bg-dark-50 hover:bg-primary-50 text-sm text-dark-600 hover:text-primary-700 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-dark-900 mb-3">Context</h3>
              <input
                type="text"
                placeholder="e.g., Python Course"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="input-field text-sm"
              />
              <p className="text-xs text-dark-400 mt-1">Add context for better answers</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <div className="card h-[600px] flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start space-x-3 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'ai' ? 'bg-primary-100' : 'bg-primary-600'
                    }`}
                  >
                    {msg.role === 'ai' ? (
                      <FiCpu className="h-4 w-4 text-primary-600" />
                    ) : (
                      <FiUser className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] rounded-xl p-4 ${
                      msg.role === 'ai'
                        ? 'bg-dark-50 text-dark-800'
                        : 'bg-primary-600 text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiCpu className="h-4 w-4 text-primary-600" />
                  </div>
                  <div className="bg-dark-50 rounded-xl p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-dark-200 p-4">
              <div className="flex items-center space-x-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask your doubt..."
                  className="input-field resize-none"
                  rows={2}
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="btn-primary p-3 !px-4"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
              <p className="text-xs text-dark-400 mt-2">
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDoubtSolver;

