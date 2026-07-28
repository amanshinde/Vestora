import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="loader-container" style={{ minHeight: '100vh' }}>
        <div className="vestora-v-loader">V</div>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginTop: '0.25rem' }}>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
