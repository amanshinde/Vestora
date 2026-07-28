import { useState } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  {
    path: '/dashboard',
    label: 'Overview',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" />
        <rect x="14" y="3" width="7" height="5" />
        <rect x="14" y="12" width="7" height="9" />
        <rect x="3" y="16" width="7" height="5" />
      </svg>
    ),
  },
  {
    path: '/investments',
    label: 'Allocations',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    path: '/roi-history',
    label: 'Yield Ledger',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    path: '/referral-income',
    label: 'Network Yield',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    path: '/referrals',
    label: 'My Network',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recharging, setRecharging] = useState(false);
  const [rechargeMsg, setRechargeMsg] = useState(false);
  const { user, logout, addDemoCapital } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRecharge = async () => {
    try {
      setRecharging(true);
      await addDemoCapital();
      setRechargeMsg(true);
      setTimeout(() => setRechargeMsg(false), 3000);
    } catch (err) {
      console.error('Failed to recharge demo capital:', err);
    } finally {
      setRecharging(false);
    }
  };

  return (
    <div style={styles.layout}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className="dashboard-sidebar"
        style={{
          ...styles.sidebar,
          ...(sidebarOpen ? styles.sidebarOpen : {}),
        }}
      >
        <div style={styles.sidebarHeader}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={styles.logo}>VESTORA</h2>
            <span style={styles.logoSub}>MEMBER TERMINAL</span>
          </Link>
        </div>

        <nav style={styles.nav}>
          <span style={styles.navSectionHeader}>TELEMETRY & ASSETS</span>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                ...styles.navItem,
                ...(isActive ? styles.navItemActive : {}),
              })}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user?.fullName?.charAt(0)?.toUpperCase() || 'V'}
            </div>
            <div style={styles.userDetails}>
              <p style={styles.userName}>{user?.fullName || 'Verified Member'}</p>
              <p style={styles.userEmail}>{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <button
            style={styles.menuBtn}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle Navigation Menu"
          >
            ☰
          </button>

          <div style={styles.headerLeft}>
            <span style={styles.statusIndicator}>● LIVE ENGINE</span>
            {rechargeMsg && (
              <span style={{ marginLeft: '14px', color: '#c5a059', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                ✓ +₹100,000 DEMO CAPITAL CREDITED
              </span>
            )}
          </div>

          <div style={styles.headerRight}>
            <button
              onClick={handleRecharge}
              disabled={recharging}
              style={{
                background: 'rgba(197, 160, 89, 0.1)',
                border: '1px solid rgba(197, 160, 89, 0.35)',
                color: '#c5a059',
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontFamily: 'monospace',
                letterSpacing: '0.05em'
              }}
            >
              {recharging ? 'SYNCING...' : '＋ ADD DEMO CAPITAL'}
            </button>
            <div style={styles.walletBadge}>
              <span style={{ color: '#757582', fontSize: '0.75rem', marginRight: '6px' }}>LIQUID WALLET</span>
              <span>₹{(user?.walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
            <div style={styles.referralBadge}>
              <span style={{ color: '#757582', fontSize: '0.75rem', marginRight: '6px' }}>REF CODE</span>
              <span style={{ color: '#c5a059', fontFamily: 'monospace' }}>{user?.referralCode || ''}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const styles = {
  layout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#080808',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 40,
    backdropFilter: 'blur(6px)',
  },
  sidebar: {
    width: '270px',
    backgroundColor: '#121216',
    borderRight: '1px solid rgba(255, 255, 255, 0.07)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    transform: 'translateX(-100%)',
  },
  sidebarOpen: {
    transform: 'translateX(0)',
  },
  sidebarHeader: {
    padding: '1.75rem 1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '0.25em',
    color: '#fbfaf6',
    margin: 0,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  logoSub: {
    fontSize: '0.68rem',
    color: '#757582',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginTop: '0.25rem',
    display: 'block',
    fontFamily: 'monospace',
  },
  nav: {
    flex: 1,
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    overflowY: 'auto',
  },
  navSectionHeader: {
    fontSize: '0.7rem',
    color: '#52525c',
    letterSpacing: '0.1em',
    fontWeight: 700,
    padding: '0 0.75rem 0.5rem',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.85rem',
    padding: '0.75rem 1rem',
    borderRadius: '6px',
    color: '#a1a1aa',
    fontSize: '0.9rem',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all 0.2s ease',
  },
  navItemActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    color: '#fbfaf6',
    fontWeight: 600,
    borderLeft: '2px solid #c5a059',
  },
  navIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#757582',
  },
  sidebarFooter: {
    padding: '1.25rem 1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.07)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '6px',
    backgroundColor: '#1b1b22',
    border: '1px solid rgba(197, 160, 89, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#c5a059',
    flexShrink: 0,
  },
  userDetails: {
    minWidth: 0,
    flex: 1,
  },
  userName: {
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#fbfaf6',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userEmail: {
    fontSize: '0.75rem',
    color: '#757582',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    width: '100%',
    padding: '0.6rem',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '6px',
    color: '#c2c2cc',
    fontSize: '0.82rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontFamily: 'var(--font-family)',
  },
  header: {
    height: '70px',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
    backgroundColor: 'rgba(8, 8, 8, 0.85)',
    backdropFilter: 'blur(16px)',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: '#fbfaf6',
    fontSize: '1.4rem',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
  },
  statusIndicator: {
    fontSize: '0.72rem',
    fontFamily: 'monospace',
    color: '#10b981',
    letterSpacing: '0.1em',
    fontWeight: 600,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  walletBadge: {
    padding: '0.45rem 1rem',
    background: '#121216',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: '#10b981',
    fontVariantNumeric: 'tabular-nums',
    display: 'flex',
    alignItems: 'center',
  },
  referralBadge: {
    padding: '0.45rem 1rem',
    background: '#121216',
    border: '1px solid rgba(255, 255, 255, 0.07)',
    borderRadius: '6px',
    fontSize: '0.85rem',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    padding: '2.5rem 2rem',
    maxWidth: '1440px',
    width: '100%',
    margin: '0 auto',
  },
};

const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @media (min-width: 1024px) {
    .dashboard-sidebar {
      transform: translateX(0) !important;
    }
  }
`;
if (typeof document !== 'undefined' && !document.getElementById('dashboard-responsive-style')) {
  styleSheet.id = 'dashboard-responsive-style';
  document.head.appendChild(styleSheet);
}

if (typeof window !== 'undefined') {
  const updateSidebarStyles = () => {
    const isDesktop = window.innerWidth >= 1024;
    styles.sidebar.transform = isDesktop ? 'translateX(0)' : 'translateX(-100%)';
    styles.main.marginLeft = isDesktop ? '270px' : '0';
    styles.menuBtn.display = isDesktop ? 'none' : 'block';
  };
  updateSidebarStyles();
  window.addEventListener('resize', updateSidebarStyles);
}

export default DashboardLayout;
