import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card scale-in">
          <div className="auth-logo">
            <Link to="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
              <h1>VESTORA</h1>
            </Link>
            <p>Sign in to your member dashboard</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                className="form-input"
                placeholder="client@vestora.com"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                className="form-input"
                placeholder="••••••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            Don't have a member account?{' '}
            <Link to="/register">Open Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
