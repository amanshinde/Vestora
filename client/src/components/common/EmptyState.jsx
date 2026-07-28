const EmptyState = ({ symbol = '◇', title = 'No data recorded yet', text = '' }) => (
  <div className="empty-state">
    <div className="empty-state-symbol">{symbol}</div>
    <h3 className="empty-state-title">{title}</h3>
    {text && <p className="empty-state-text">{text}</p>}
  </div>
);

export default EmptyState;
