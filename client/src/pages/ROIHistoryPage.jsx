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
        setError(err.response?.data?.message || 'Failed to initialize yield ledger history');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Yield Ledger</h1>
        <p className="page-subtitle">Audited record of automated midnight return processing</p>
      </div>

      {error ? (
        <div className="alert alert-error"><span>{error}</span></div>
      ) : loading ? (
        <Loader text="Retrieving ledger sessions..." />
      ) : history.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            symbol="◇"
            title="No return sessions logged"
            text="Yield processing entries will appear here after automated midnight scheduler executions."
          />
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Execution Date</th>
                <th>Origin Term</th>
                <th>Yield Rate</th>
                <th>Amount Credited</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map((roi) => (
                <tr key={roi._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    {new Date(roi.processingDate).toLocaleDateString()}
                  </td>
                  <td>
                    {roi.investment ? (
                      <span style={{ color: '#fbfaf6', fontWeight: 500 }}>
                        {roi.investment.plan?.name} <span style={{ color: '#757582' }}>— ₹{Number(roi.investment.amount).toLocaleString('en-IN')}</span>
                      </span>
                    ) : (
                      <span style={{ color: '#757582' }}>—</span>
                    )}
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{roi.roiPercentage}%</td>
                  <td style={{ fontWeight: 600, color: '#10b981', fontFamily: 'monospace' }}>
                    + ₹{Number(roi.roiAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
