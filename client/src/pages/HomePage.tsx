import { Link } from 'react-router-dom';
import type { CSSProperties } from 'react';
import './HomePage.css';

const stats = [
  { label: 'Total Problems', value: '2', icon: '📝', color: '#58a6ff' },
  { label: 'Easy', value: '2', icon: '🟢', color: '#3fb950' },
  { label: 'Medium', value: '0', icon: '🟡', color: '#d29922' },
  { label: 'Hard', value: '0', icon: '🔴', color: '#f85149' },
];

const features = [
  {
    title: 'Solve Problems',
    desc: 'Practice coding problems across different categories and difficulty levels.',
    icon: '💻',
  },
  {
    title: 'Write & Submit Code',
    desc: 'Write your solution in JavaScript or TypeScript and submit it for evaluation.',
    icon: '✍️',
  },
  {
    title: 'Track Progress',
    desc: 'View your submission history and see which problems you have solved.',
    icon: '📊',
  },
  {
    title: 'JWT Authentication',
    desc: 'Secure login and registration with JSON Web Tokens and bcrypt password hashing.',
    icon: '🔐',
  },
];

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">MERN + TypeScript</div>
          <h1>Practice Coding Problems</h1>
          <p className="hero-desc">
            A LeetCode-style platform built with MongoDB, Express, React, and TypeScript.
            Solve problems, submit solutions, and track your progress.
          </p>
          <div className="hero-actions">
            <Link to="/problems" className="btn btn-primary">
              Browse Problems
            </Link>
            <Link to="/submissions" className="btn btn-secondary">
              View Submissions
            </Link>
          </div>
        </div>
        <div className="hero-stats">
          {stats.map((s) => (
            <div key={s.label} className="stat-card" style={{ ['--stat-color' as string]: s.color }}>
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Platform Features</h2>
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="tech-section">
        <h2 className="section-title">Tech Stack</h2>
        <div className="tech-grid">
          {['React 18', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'React Router v6', 'Vite'].map((t) => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
