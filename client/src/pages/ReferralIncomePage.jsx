import { useState, useEffect } from 'react';
import { getReferralIncome } from '../api/referral.api.js';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';

const ReferralIncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getReferralIncome({ page, limit: 10 });
        setIncomes(res.data.data);
        setPagination(res.data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load referral income');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Referral Income</h1>
        <p className="page-subtitle">Earnings from your referral network</p>
      </div>

      {error ? (
        <div className="alert alert-error">⚠️ {error}</div>
      ) : loading ? (
        <Loader text="Loading referral income..." />
      ) : incomes.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            icon="💎"
            title="No referral income yet"
            text="Earn income when your referred users generate ROI from their investments."
          />
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>Level</th>
                <th>Percentage</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income._id}>
                  <td>{new Date(income.processingDate).toLocaleDateString()}</td>
                  <td>
                    {income.sourceUser ? (
                      <div>
                        <p style={{ fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>
                          {income.sourceUser.fullName}
                        </p>
                        <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                          {income.sourceUser.email}
                        </p>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span className="tree-level-badge">Level {income.level}</span>
                  </td>
                  <td>{income.percentage}%</td>
                  <td style={{ fontWeight: 600, color: 'var(--color-info)' }}>
                    +₹{Number(income.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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

export default ReferralIncomePage;
