import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { Problem } from '../types';
import './ProblemsPage.css';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
  const [solveOpen, setSolveOpen] = useState(false);

  useEffect(() => {
    api.getProblems()
      .then(setProblems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = problems.filter((p) => activeFilter === 'All' || p.difficulty === activeFilter);

  if (loading) return <div className="page-loading">Loading problems...</div>;
  if (error) return <div className="page-error">Failed to load: {error}</div>;

  return (
    <div className="problems-page">
      <div className="page-head">
        <h1>Problem Set</h1>
        <p className="page-subtitle">Select a problem to start solving</p>
      </div>

      <div className="filter-bar">
        {(['All', 'Easy', 'Medium', 'Hard'] as const).map((f) => (
          <button
            key={f}
            className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => setActiveFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No problems found</h3>
          <p>Try a different filter or add a new problem.</p>
        </div>
      ) : (
        <div className="problems-grid">
          {filtered.map((problem) => (
            <article key={problem._id} className="problem-card">
              <div className={`difficulty-badge diff-${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </div>
              <div className="problem-content">
                <h3 className="problem-title">{problem.title}</h3>
                <p className="problem-desc">{problem.description}</p>
                <div className="problem-meta">
                  <span className="meta-item">
                    <span className="meta-dot" />
                    {problem.category}
                  </span>
                </div>
              </div>
              <div className="problem-actions">
                <Link
                  to={`/solve/${problem._id}`}
                  className="btn btn-primary btn-sm"
                  onClick={() => setSolveOpen(true)}
                >
                  Solve
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}

      {problems.length === 0 && !loading && (
        <div className="problems-empty">
          <div className="empty-card">
            <h3>No Problems Yet</h3>
            <p>The problem database is empty. You can add problems via the server API.</p>
            <div className="curl-example">
              <code>
                curl -X POST http://localhost:5000/api/problems -H 'Content-Type: application/json' -d '{
                  "title": "Two Sum",
                  "description": "Given an array and a target, return indices...",
                  "difficulty": "Easy",
                  "category": "Arrays",
                  "starterCode": "function solve(input) { ... }",
                  "testCases": [{ "input": "{}", "expected": "[]" }]
                }'
              </code>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
