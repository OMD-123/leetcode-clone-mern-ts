import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

export default function Layout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="layout">
      <header className="header">
        <Link to="/" className="logo">
          <span className="logo-icon">{'</>'}</span>
          <span className="logo-text">LeetCode Clone</span>
        </Link>
        <nav className="nav">
          <Link to="/problems" className={location.pathname === '/problems' ? 'active' : ''}>
            Problems
          </Link>
          <Link to="/submissions" className={location.pathname === '/submissions' ? 'active' : ''}>
            My Submissions
          </Link>
        </nav>
        <div className="user-section">
          <span className="user-greeting">Hi, {user?.username}</span>
          <button className="btn btn-ghost" onClick={logout}>Logout</button>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
