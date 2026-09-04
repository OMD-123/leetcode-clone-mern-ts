import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api/client';
import { Problem } from '../types';
import './SolvePage.css';

export default function SolvePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [solutionCode, setSolutionCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ testResults: any[]; status: string; runtimeMs: number } | null>(null);

  const loadProblem = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const p = await api.getProblem(id);
      setProblem(p);
      setStarterCode(p.starterCode || '');
      setSolutionCode(p.starterCode || '');
    } catch (err: any) {
      setError(err.message || 'Failed to load problem');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadProblem(); }, [loadProblem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await api.submitSolution(id, solutionCode, language);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="page-loading">Loading problem...</div>;
  if (error && !problem) return <div className="page-error">{error}</div>;
  if (!problem) return null;

  return (
    <div className="solve-page">
      <div className="solve-header">
        <Link to="/problems" className="back-link">
          <span className="back-icon">←</span>
          Back to Problems
        </Link>
        <div className={`difficulty-badge diff-${problem.difficulty.toLowerCase()}`}>
          {problem.difficulty}
        </div>
      </div>

      <div className="problem-header-card">
        <h1 className="problem-title">{problem.title}</h1>
        <span className="problem-category">{problem.category}</span>
        <p className="problem-description">{problem.description}</p>
      </div>

      <div className="solve-layout">
        <div className="solve-main">
          <div className="code-section">
            <div className="code-section-header">
              <h3>Starter Code</h3>
            </div>
            <pre className="code-block starter-block">
              <code>{problem.starterCode || '// No starter code provided'}</code>
            </pre>
          </div>

          <div className="code-section">
            <div className="code-section-header">
              <h3>Your Solution</h3>
              <div className="lang-select">
                <label>Language: </label>
                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                </select>
              </div>
            </div>
            <textarea
              className="code-editor"
              value={solutionCode}
              onChange={(e) => setSolutionCode(e.target.value)}
              spellCheck={false}
              placeholder="Write your solution here..."
            />
          </div>
        </div>

        <div className="solve-sidebar">
          <div className="test-cases-panel">
            <h3>Test Cases</h3>
            {problem.testCases && problem.testCases.length > 0 ? (
              <ul className="test-cases-list">
                {problem.testCases.map((tc, i) => (
                  <li key={i} className="test-case-item">
                    <div className="tc-label">Test #{i + 1}</div>
                    <div className="tc-input">{tc.input}</div>
                    <div className="tc-expected">Expected: {tc.expected}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-tests">No test cases defined for this problem.</p>
            )}
          </div>
        </div>
      </div>

      {error && !result && (
        <div className="error-banner">{error}</div>
      )}

      <div className="submit-bar">
        <button className="btn btn-primary submit-btn" onClick={handleSubmit} disabled={submitting || !solutionCode.trim()}>
          {submitting ? 'Submitting...' : 'Submit Solution'}
        </button>
      </div>

      {result && (
        <div className="result-section animate-in">
          <div className="result-header status-{result.status.toLowerCase()}">
            <span className="status-icon">
              {result.status === 'Passed' ? '✅' : result.status === 'Failed' ? '❌' : '⚠️'}
            </span>
            <span>{result.status}</span>
            <span className="runtime-millis">{result.runtimeMs}ms</span>
          </div>
          {result.testResults.map((tr, i) => (
            <div
              key={i}
              className={`test-result-item ${tr.passed ? 'pass' : 'fail'}`}
            >
              <span className="result-status-dot" />
              <span className="result-label">
                {tr.passed ? '✓ Pass' : '✗ Fail'}
              </span>
              <span className="result-detail">
                Expected: <code>{tr.expected}</code>
                {' → '}
                Got: <code>{tr.actual || '—'}</code>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
