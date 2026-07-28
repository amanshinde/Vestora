const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-container">
    <div className="spinner"></div>
    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>{text}</p>
  </div>
);

export default Loader;
