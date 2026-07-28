import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="vestora-footer">
      <div className="footer-top">
        <div>
          <Link to="/" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.25em', color: '#fbfaf6', textDecoration: 'none', display: 'block' }}>
            VESTORA
          </Link>
          <span style={{ color: '#5e5e66', fontSize: '0.8rem', marginTop: '0.4rem', display: 'block' }}>
            Investment & Referral Management Platform
          </span>
        </div>

        <ul className="footer-links">
          <li><a href="#philosophy" className="footer-link">Platform</a></li>
          <li><a href="#story" className="footer-link">How It Works</a></li>
          <li><a href="#network" className="footer-link">Network</a></li>
          <li><a href="#security" className="footer-link">Security</a></li>
          <li><Link to="/login" className="footer-link">Sign In</Link></li>
        </ul>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Vestora. Engineered for precision.</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <span>Privacy Architecture</span>
          <span>Terms of Service</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
