import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/investments', label: 'Investments', icon: '💰' },
  { path: '/roi-history', label: 'ROI History', icon: '📈' },
  { path: '/referral-income', label: 'Referral Income', icon: '💎' },
  { path: '/referrals', label: 'Referrals', icon: '👥' },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.layout}>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        ...(sidebarOpen ? styles.sidebarOpen : {}),
      }}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>
            <span style={styles.logoIcon}>⚡</span>
            NexaChain
          </h2>
          <span style={styles.logoSub}>AI Platform</span>
        </div>

        <nav style={styles.nav}>
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
              {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div style={styles.userDetails}>
              <p style={styles.userName}>{user?.fullName || 'User'}</p>
              <p style={styles.userEmail}>{user?.email || ''}</p>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            🚪 Logout
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
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <div style={styles.headerRight}>
            <div style={styles.walletBadge}>
              💳 ₹{(user?.walletBalance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </div>
            <div style={styles.referralBadge}>
              🔗 {user?.referralCode || ''}
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
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 40,
    backdropFilter: 'blur(4px)',
  },
  sidebar: {
    width: 'var(--sidebar-width)',
    backgroundColor: 'var(--color-bg-secondary)',
    borderRight: '1px solid var(--color-border)',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 50,
    transition: 'transform var(--transition-base)',
    transform: 'translateX(-100%)',
  },
  sidebarOpen: {
    transform: 'translateX(0)',
  },
  sidebarHeader: {
    padding: '1.5rem',
    borderBottom: '1px solid var(--color-border)',
  },
  logo: {
    fontSize: 'var(--font-size-xl)',
    fontWeight: 800,
    background: 'var(--gradient-primary)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    margin: 0,
  },
  logoIcon: {
    WebkitTextFillColor: 'initial',
  },
  logoSub: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    marginTop: '0.125rem',
  },
  nav: {
    flex: 1,
    padding: '1rem 0.75rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    overflowY: 'auto',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text-secondary)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    textDecoration: 'none',
    transition: 'all var(--transition-fast)',
  },
  navItemActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    color: 'var(--color-accent-primary-light)',
    fontWeight: 600,
  },
  navIcon: {
    fontSize: '1.125rem',
    width: '24px',
    textAlign: 'center',
  },
  sidebarFooter: {
    padding: '1rem',
    borderTop: '1px solid var(--color-border)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '0.75rem',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: 'var(--radius-full)',
    background: 'var(--gradient-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 700,
    color: 'white',
    flexShrink: 0,
  },
  userDetails: {
    minWidth: 0,
    flex: 1,
  },
  userName: {
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  userEmail: {
    fontSize: 'var(--font-size-xs)',
    color: 'var(--color-text-muted)',
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    width: '100%',
    padding: '0.5rem',
    background: 'rgba(239, 68, 68, 0.08)',
    border: '1px solid rgba(239, 68, 68, 0.15)',
    borderRadius: 'var(--radius-md)',
    color: '#f87171',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    fontFamily: 'var(--font-family)',
  },
  header: {
    height: 'var(--header-height)',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid var(--color-border)',
    backgroundColor: 'rgba(10, 14, 26, 0.8)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 30,
  },
  menuBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--color-text-primary)',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '0.25rem',
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  walletBadge: {
    padding: '0.375rem 0.875rem',
    background: 'rgba(16, 185, 129, 0.08)',
    border: '1px solid rgba(16, 185, 129, 0.15)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    color: '#34d399',
    fontVariantNumeric: 'tabular-nums',
  },
  referralBadge: {
    padding: '0.375rem 0.875rem',
    background: 'rgba(99, 102, 241, 0.08)',
    border: '1px solid rgba(99, 102, 241, 0.15)',
    borderRadius: 'var(--radius-full)',
    fontSize: 'var(--font-size-sm)',
    fontWeight: 600,
    color: 'var(--color-accent-primary-light)',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  content: {
    flex: 1,
    padding: '1.5rem',
    maxWidth: '1400px',
    width: '100%',
    margin: '0 auto',
  },
};

// Media query handled via CSS - add responsive styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @media (min-width: 1024px) {
    .dashboard-sidebar {
      transform: translateX(0) !important;
    }
  }
`;
document.head.appendChild(styleSheet);

// Override sidebar for desktop
if (typeof window !== 'undefined') {
  const updateSidebarStyles = () => {
    const isDesktop = window.innerWidth >= 1024;
    styles.sidebar.transform = isDesktop ? 'translateX(0)' : 'translateX(-100%)';
    styles.main.marginLeft = isDesktop ? 'var(--sidebar-width)' : '0';
    styles.menuBtn.display = isDesktop ? 'none' : 'block';
  };
  updateSidebarStyles();
  window.addEventListener('resize', updateSidebarStyles);
}

export default DashboardLayout;
