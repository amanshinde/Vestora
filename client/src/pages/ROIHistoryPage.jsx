import { useState, useEffect } from 'react';
import { getROIHistory } from '../api/roi.api.js';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';

const ROIHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getROIHistory({ page, limit: 10 });
        setHistory(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ROI history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">ROI History</h1>
        <p className="page-subtitle">Track your daily return on investment earnings</p>
      </div>

      {error ? (
        <div className="alert alert-error">⚠️ {error}</div>
      ) : loading ? (
        <Loader text="Loading ROI history..." />
      ) : history.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            icon="📈"
            title="No ROI history yet"
            text="ROI earnings will appear here after daily processing runs."
          />
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Investment</th>
                <th>ROI %</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((roi) => (
                <tr key={roi._id}>
                  <td>{new Date(roi.processingDate).toLocaleDateString()}</td>
                  <td>
                    {roi.investment ? (
                      <span>
                        {roi.investment.plan?.name} — ₹{Number(roi.investment.amount).toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)' }}>—</span>
                    )}
                  </td>
                  <td>{roi.roiPercentage}%</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-success)' }}>
                    +₹{Number(roi.roiAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </td>
                  <td>
                    <span className={`badge badge-${roi.status.toLowerCase()}`}>
                      {roi.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination pagination={pagination} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default ROIHistoryPage;
