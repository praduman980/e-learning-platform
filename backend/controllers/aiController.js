const asyncHandler = require('express-async-handler');
const axios = require('axios');

// Local knowledge base for common programming & CS questions (fallback when OpenAI is unavailable)
const LOCAL_ANSWERS = {
  'react': `React is a JavaScript library for building user interfaces. Key concepts:

**Components**: Reusable UI pieces (functional or class-based)
**JSX**: JavaScript XML syntax for writing HTML-like code in JavaScript
**State**: Data that changes over time (useState hook)
**Props**: Data passed from parent to child components
**Effects**: Side effects like data fetching (useEffect hook)
**Hooks**: Functions like useState, useEffect, useContext that let you use React features

Example of a simple React component:
\`\`\`jsx
function Welcome({ name }) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>Clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
\`\`\``,
  'javascript': `JavaScript is a versatile programming language. Key concepts:

**Variables**: let, const, var
**Functions**: Regular functions, arrow functions, callbacks
**Promises**: Handle async operations with .then() or async/await
**Arrays**: map(), filter(), reduce(), forEach()
**Objects**: Key-value pairs, JSON
**Closures**: Functions that remember their lexical scope

Example:
\`\`\`javascript
// Async/await for API calls
async function fetchData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}
\`\`\``,
  'python': `Python is a high-level, interpreted programming language. Key concepts:

**Data Types**: int, float, str, list, dict, tuple, set
**Control Flow**: if/elif/else, for/while loops
**Functions**: def, lambda, *args, **kwargs
**List Comprehensions**: [x**2 for x in range(10)]
**Decorators**: @staticmethod, @classmethod, @property
**Modules**: import, from, pip

Example:
\`\`\`python
# List comprehension with condition
squares = [x**2 for x in range(10) if x % 2 == 0]
print(squares)  # [0, 4, 16, 36, 64]

# Decorator example
def timer(func):
    def wrapper(*args, **kwargs):
        import time
        start = time.time()
        result = func(*args, **kwargs)
        print(f"Took {time.time() - start}s")
        return result
    return wrapper
\`\`\``,
  'rest': `**REST vs GraphQL:**

REST (Representational State Transfer):
- Uses HTTP methods: GET, POST, PUT, DELETE
- Each endpoint returns fixed data structure
- Multiple endpoints for different resources
- Caching is easier
- Better for simple CRUD operations

GraphQL:
- Single endpoint for all queries
- Client specifies exactly what data it needs
- Reduces over-fetching and under-fetching
- Strongly typed schema
- Better for complex, nested data requirements

Choose REST for simpler APIs, GraphQL for complex data requirements.`,
  'default': `I'm here to help you with your learning! Here are some general tips:

1. **Break down complex problems** into smaller, manageable parts
2. **Practice regularly** - Coding is a skill that improves with practice
3. **Read documentation** - Official docs are your best friend
4. **Build projects** - Apply what you learn in real projects
5. **Join communities** - Stack Overflow, GitHub, Discord servers

If you have a specific question about programming, web development, data science, or any course topic, feel free to ask and I'll provide a detailed explanation!`
};

function getLocalAnswer(question) {
  const q = question.toLowerCase();
  if (q.includes('react') || q.includes('hook') || q.includes('component') || q.includes('jsx')) return LOCAL_ANSWERS.react;
  if (q.includes('javascript') || q.includes('async') || q.includes('promise') || q.includes('closure')) return LOCAL_ANSWERS.javascript;
  if (q.includes('python') || q.includes('decorator') || q.includes('list comprehension') || q.includes('django')) return LOCAL_ANSWERS.python;
  if (q.includes('rest') || (q.includes('graphql') && (q.includes('difference') || q.includes('vs') || q.includes('versus')))) return LOCAL_ANSWERS.rest;
  return LOCAL_ANSWERS.default;
}

// @desc    Ask AI doubt solver
// @route   POST /api/ai/ask
const askAI = asyncHandler(async (req, res) => {
  const { question, context, courseTitle } = req.body;

  if (!question) {
    res.status(400);
    throw new Error('Question is required');
  }

  const apiKey = process.env.OPENAI_API_KEY;
  
  // If OpenAI API key is not configured or is the placeholder, use local knowledge base
  if (!apiKey || apiKey === 'your_openai_api_key' || apiKey.startsWith('your_')) {
    const localAnswer = getLocalAnswer(question);
    return res.json({
      answer: localAnswer,
      model: 'local-knowledge-base',
      note: 'Using local knowledge base. Configure OPENAI_API_KEY in .env for AI-powered responses.',
    });
  }

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are an expert tutor helping students with their coursework. 
            You provide clear, detailed explanations and guide students to understand concepts 
            rather than just giving answers. Be supportive, encouraging, and educational.
            ${
              context
                ? `The student is currently studying: ${context}`
                : ''
            }
            ${
              courseTitle
                ? `Course: ${courseTitle}`
                : ''
            }`,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;

    res.json({
      answer: aiResponse,
      model: 'gpt-3.5-turbo',
      usage: response.data.usage,
    });
  } catch (error) {
    console.error('AI error:', error.response?.data || error.message);

    // Fallback to local knowledge base
    const localAnswer = getLocalAnswer(question);
    res.json({
      answer: localAnswer,
      model: 'fallback-local',
      note: 'OpenAI API unavailable. Used local knowledge base instead.',
    });
  }
});

// @desc    Get AI conversation history
// @route   GET /api/ai/history
const getAIHistory = asyncHandler(async (req, res) => {
  // In a full implementation, you'd store conversation history in MongoDB
  res.json({ message: 'Conversation history feature coming soon' });
});

module.exports = {
  askAI,
  getAIHistory,
};

