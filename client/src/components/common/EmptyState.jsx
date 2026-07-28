const EmptyState = ({ icon = '📭', title = 'No data yet', text = '' }) => (
  <div className="empty-state">
    <div className="empty-state-icon">{icon}</div>
    <h3 className="empty-state-title">{title}</h3>
    {text && <p className="empty-state-text">{text}</p>}
  </div>
);

export default EmptyState;
