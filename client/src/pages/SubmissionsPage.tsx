import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Submission } from '../types';
import './SubmissionsPage.css';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMySubmissions()
      .then(setSubmissions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: submissions.length,
    passed: submissions.filter(s => s.status === 'Passed').length,
    failed: submissions.filter(s => s.status === 'Failed').length,
    pending: submissions.filter(s => s.status === 'Pending' || s.status === 'Error').length,
  };

  if (loading) return <div className="page-loading">Loading submissions...</div>;

  return (
    <div className="submissions-page">
      <div className="page-head">
        <h1>My Submissions</h1>
        <p className="page-subtitle">Track your problem-solving activity</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card stat-passed">
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{stats.passed}</div>
          <div className="stat-label">Passed</div>
        </div>
        <div className="stat-card stat-failed">
          <div className="stat-value" style={{ color: 'var(--accent-red)' }}>{stats.failed}</div>
          <div className="stat-label">Failed</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-value" style={{ color: 'var(--accent-yellow)' }}>{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No submissions yet</h3>
          <p>Go to Problems to solve your first question.</p>
        </div>
      ) : (
        <div className="submissions-list">
          {submissions.map((sub) => (
            <div key={sub._id} className="submission-card">
              <div className="submission-header">
                <div>
                  <h3>{sub.problem?.title || 'Unknown Problem'}</h3>
                  <span className={`difficulty-badge diff-${sub.problem?.difficulty?.toLowerCase() || 'easy'}`}>
                    {sub.problem?.difficulty || 'Easy'}
                  </span>
                </div>
                <div className={`result-badge ${sub.status.toLowerCase()}`}>
                  {sub.status === 'Passed' ? '✅' : sub.status === 'Failed' ? '❌' : '⏳'} {sub.status}
                </div>
              </div>

              <div className="submission-meta">
                <span className="meta-item">💻 {sub.language || 'javascript'}</span>
                <span className="meta-item">⏱ {sub.runtimeMs || '—'}ms</span>
                <span className="meta-item">📅 {new Date(sub.createdAt).toLocaleString()}</span>
              </div>

              {sub.testResults && sub.testResults.length > 0 && (
                <div className="test-results">
                  {sub.testResults.map((tr, i) => (
                    <div key={i} className={`test-result-row ${tr.passed ? 'pass' : 'fail'}`}>
                      <span className="test-dot" />
                      <code>Input: {tr.input}</code>
                      {tr.passed ? (
                        <span className="test-ok">✓ Expected: {tr.expected}</span>
                      ) : (
                        <span className="test-fail">Expected: {tr.expected} | Got: {tr.actual || 'ERROR'}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
