const asyncHandler = require('express-async-handler');
const axios = require('axios');

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';
const PISTON_VERSIONS_URL = 'https://emkc.org/api/v2/piston/versions';

// Predefined fallback languages and versions for the API
const FALLBACK_LANGUAGES = [
  { name: 'JavaScript', language: 'javascript', version: '18.15.0' },
  { name: 'Python', language: 'python', version: '3.10.0' },
  { name: 'Java', language: 'java', version: '15.0.2' },
  { name: 'C++', language: 'cpp', version: '10.2.0' },
  { name: 'C', language: 'c', version: '10.2.0' },
  { name: 'C#', language: 'csharp', version: '6.12.0' },
  { name: 'Go', language: 'go', version: '1.16.2' },
  { name: 'Ruby', language: 'ruby', version: '3.0.1' },
  { name: 'Rust', language: 'rust', version: '1.68.0' },
  { name: 'TypeScript', language: 'typescript', version: '5.0.3' },
  { name: 'PHP', language: 'php', version: '8.2.3' },
  { name: 'Swift', language: 'swift', version: '5.3.3' },
  { name: 'Kotlin', language: 'kotlin', version: '1.8.20' },
  { name: 'R', language: 'r', version: '4.1.2' },
  { name: 'Perl', language: 'perl', version: '5.36.0' },
  { name: 'Haskell', language: 'haskell', version: '9.0.1' },
  { name: 'Scala', language: 'scala', version: '3.3.0' },
  { name: 'Dart', language: 'dart', version: '2.19.0' },
  { name: 'Lua', language: 'lua', version: '5.4.4' },
  { name: 'Bash', language: 'bash', version: '5.2.0' },
];

// @desc    Get supported languages
// @route   GET /api/compiler/languages
const getLanguages = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(PISTON_VERSIONS_URL);
    if (response.data && Array.isArray(response.data)) {
      // Map the response to our format
      const languages = response.data.map((lang) => ({
        name: lang.language.charAt(0).toUpperCase() + lang.language.slice(1),
        language: lang.language,
        version: lang.version,
      }));
      return res.json(languages);
    }
  } catch (error) {
    console.log('Using fallback languages (Piston API unavailable):', error.message);
  }
  res.json(FALLBACK_LANGUAGES);
});

// @desc    Execute code locally for JavaScript
// @route   POST /api/compiler/execute-local
const executeLocalJS = asyncHandler(async (req, res) => {
  const { code, stdin } = req.body;
  if (!code) {
    res.status(400);
    throw new Error('Code is required');
  }

  try {
    const vm = require('vm');
    let output = '';
    const sandbox = {
      console: {
        log: (...args) => {
          output += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ') + '\n';
        },
      },
    };
    vm.runInNewContext(code, sandbox, { timeout: 5000 });

    res.json({
      output: output || '(no output)',
      stdout: output,
      stderr: '',
      compileOutput: '',
      exitCode: 0,
      signal: null,
      executionTime: 'N/A (local)',
      memory: 'N/A',
    });
  } catch (error) {
    res.json({
      output: `Error: ${error.message}`,
      stdout: '',
      stderr: error.message,
      compileOutput: '',
      exitCode: 1,
      signal: null,
      executionTime: 'N/A',
      memory: 'N/A',
    });
  }
});

// @desc    Execute code
// @route   POST /api/compiler/execute
const executeCode = asyncHandler(async (req, res) => {
  const { language, code, stdin } = req.body;

  if (!language || !code) {
    res.status(400);
    throw new Error('Language and code are required');
  }

  // Find language config
  const langConfig = FALLBACK_LANGUAGES.find(
    (l) => l.language === language
  );

  if (!langConfig) {
    res.status(400);
    throw new Error(`Language '${language}' is not supported`);
  }

  try {
    const response = await axios.post(PISTON_API_URL, {
      language: langConfig.language,
      version: langConfig.version,
      files: [
        {
          content: code,
        },
      ],
      stdin: stdin || '',
      args: [],
      compile_timeout: 10000,
      run_timeout: 5000,
    });

    const result = response.data;

    res.json({
      output: result.run.output,
      stdout: result.run.stdout,
      stderr: result.run.stderr,
      compileOutput: result.compile?.output || '',
      exitCode: result.run.code,
      signal: result.run.signal || null,
      executionTime: `${result.run.time}ms`,
      memory: `${result.run.memory}KB`,
    });
  } catch (error) {
    console.error('Compiler error:', error.message);
    // Return a helpful error response instead of throwing
    res.json({
      output: `⚠️ Piston API temporarily unavailable. 

The online code execution service is not responding. Here's what you can do:

1. **Try again later** - The service may be temporarily down
2. **Check your code** - Make sure your code is syntactically correct
3. **Try a different language** - Some languages may work

Your code:
\`\`\`
${code.substring(0, 200)}${code.length > 200 ? '...' : ''}
\`\`\``,
      stdout: '',
      stderr: error.message,
      compileOutput: '',
      exitCode: -1,
      signal: 'Service Unavailable',
      executionTime: 'N/A',
      memory: 'N/A',
    });
  }
});

module.exports = {
  getLanguages,
  executeCode,
  executeLocalJS,
};

