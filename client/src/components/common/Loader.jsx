const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-container">
    <div className="vestora-v-loader">V</div>
    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500, marginTop: '0.25rem' }}>{text}</p>
  </div>
);

export default Loader;
