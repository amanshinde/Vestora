import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const Navbar = () => {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`vestora-nav ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo">
          VESTORA
        </Link>

        <ul className="nav-links">
          <li><a href="#philosophy" className="nav-link">Platform</a></li>
          <li><a href="#story" className="nav-link">How It Works</a></li>
          <li><a href="#network" className="nav-link">Network</a></li>
          <li><a href="#security" className="nav-link">Security</a></li>
        </ul>

        <div className="nav-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn-vestora-primary">
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link to="/login" className="nav-link" style={{ textDecoration: 'none', color: '#fbfaf6', fontWeight: 600 }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-vestora-primary">
                <span>Get Started</span>
              </Link>
            </>
          )}
        </div>

        <button 
          className="mobile-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>
      </nav>

      <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#philosophy" className="nav-link" onClick={closeMenu}>Platform</a>
        <a href="#story" className="nav-link" onClick={closeMenu}>How It Works</a>
        <a href="#network" className="nav-link" onClick={closeMenu}>Network</a>
        <a href="#security" className="nav-link" onClick={closeMenu}>Security</a>
        {isAuthenticated ? (
          <Link to="/dashboard" className="btn-vestora-primary" onClick={closeMenu}>
            <span>Dashboard</span>
          </Link>
        ) : (
          <>
            <Link to="/login" className="btn-vestora-secondary" onClick={closeMenu}>
              <span>Sign In</span>
            </Link>
            <Link to="/register" className="btn-vestora-primary" onClick={closeMenu}>
              <span>Get Started</span>
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
