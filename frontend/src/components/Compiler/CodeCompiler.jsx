import { useState, useEffect } from 'react';
import API from '../../api/axios';
import { FiPlay, FiTrash2, FiCopy, FiCheck, FiTerminal } from 'react-icons/fi';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs2015 } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const LANGUAGE_TEMPLATES = {
  javascript: '// Write your JavaScript code here\nconsole.log("Hello, World!");',
  python: '# Write your Python code here\nprint("Hello, World!")',
  java: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
  cpp: '// Write your C++ code here\n#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
  c: '// Write your C code here\n#include <stdio.h>\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}',
  typescript: '// Write your TypeScript code here\nconst greet = (name: string): string => {\n  return `Hello, ${name}!`;\n};\nconsole.log(greet("World"));',
  go: '// Write your Go code here\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}',
  rust: '// Write your Rust code here\nfn main() {\n    println!("Hello, World!");\n}',
  ruby: '# Write your Ruby code here\nputs "Hello, World!"',
  php: '<?php\n// Write your PHP code here\necho "Hello, World!";\n?>',
  bash: '#!/bin/bash\n# Write your Bash script here\necho "Hello, World!"',
};

const CodeCompiler = () => {
  const [code, setCode] = useState(LANGUAGE_TEMPLATES.javascript);
  const [language, setLanguage] = useState('javascript');
  const [stdin, setStdin] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    fetchLanguages();
  }, []);

  const fetchLanguages = async () => {
    try {
      const { data } = await API.get('/compiler/languages');
      setLanguages(data);
    } catch (error) {
      console.error('Failed to fetch languages:', error);
    }
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setLanguage(lang);
    setCode(LANGUAGE_TEMPLATES[lang] || '// Write your code here');
    setOutput('');
  };

  const handleRun = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const endpoint = language === 'javascript' ? '/compiler/execute-local' : '/compiler/execute';
      const { data } = await API.post(endpoint, { language, code, stdin });
      setOutput(data.output || data.stdout || data.stderr || 'No output');
    } catch (error) {
      setOutput(error.response?.data?.message || 'Error executing code');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode('');
    setOutput('');
    setStdin('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-dark-900">Code Compiler</h1>
          <p className="text-dark-500">Write, compile, and run code in 20+ languages</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <select
              value={language}
              onChange={handleLanguageChange}
              className="input-field"
            >
              {languages.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {lang.name}
                </option>
              ))}
            </select>
            <button onClick={handleClear} className="btn-secondary" title="Clear">
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-dark-900 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-dark-800">
              <span className="text-sm text-dark-400">Code Editor</span>
              <span className="text-xs text-dark-500">{code.split('\n').length} lines</span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 bg-dark-900 text-green-400 p-4 font-mono text-sm resize-none focus:outline-none"
              spellCheck={false}
              style={{ caretColor: 'white' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-700 mb-1">Standard Input</label>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="input-field h-20 font-mono text-sm resize-none"
              placeholder="Provide input for your program..."
            />
          </div>

          <button
            onClick={handleRun}
            disabled={loading || !code.trim()}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <FiPlay className="h-4 w-4" />
                <span>Run Code</span>
              </>
            )}
          </button>
        </div>

        {/* Output */}
        <div className="bg-dark-900 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-dark-800">
            <div className="flex items-center space-x-2">
              <FiTerminal className="h-4 w-4 text-dark-400" />
              <span className="text-sm text-dark-400">Output</span>
            </div>
            <button
              onClick={handleCopy}
              className="text-dark-400 hover:text-white transition-colors"
              title="Copy output"
            >
              {copied ? <FiCheck className="h-4 w-4 text-green-500" /> : <FiCopy className="h-4 w-4" />}
            </button>
          </div>
          <pre className="h-96 p-4 font-mono text-sm text-green-400 overflow-auto whitespace-pre-wrap">
            {output || (
              <span className="text-dark-500">
                {loading ? 'Running your code...' : 'Click "Run Code" to see output'}
              </span>
            )}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default CodeCompiler;

