import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import ProblemsPage from './pages/ProblemsPage';
import SolvePage from './pages/SolvePage';
import SubmissionsPage from './pages/SubmissionsPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return user ? <>{children}</> : <Navigate to="/auth" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="problems" element={<ProblemsPage />} />
        <Route path="solve/:id" element={<SolvePage />} />
        <Route path="submissions" element={<SubmissionsPage />} />
      </Route>
    </Routes>
  );
}
