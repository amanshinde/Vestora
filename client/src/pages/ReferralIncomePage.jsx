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
        setError(err.response?.data?.message || 'Failed to load network propagation ledger');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page]);

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Network Yield</h1>
        <p className="page-subtitle">Hierarchical revenue propagation across connected network tiers</p>
      </div>

      {error ? (
        <div className="alert alert-error"><span>{error}</span></div>
      ) : loading ? (
        <Loader text="Loading network yield credits..." />
      ) : incomes.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            symbol="◇"
            title="No network yield accumulated yet"
            text="Multi-tier revenue propagates automatically when connected partner accounts generate return on investment."
          />
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Origin Node</th>
                <th>Network Tier</th>
                <th>Tier Commission</th>
                <th>Credit Value</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((income) => (
                <tr key={income._id}>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    {new Date(income.processingDate).toLocaleDateString()}
                  </td>
                  <td>
                    {income.sourceUser ? (
                      <div>
                        <p style={{ fontWeight: 600, color: '#fbfaf6', margin: 0 }}>
                          {income.sourceUser.fullName}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#757582', margin: 0, fontFamily: 'monospace' }}>
                          {income.sourceUser.email}
                        </p>
                      </div>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <span className="tree-level-badge">LEVEL 0{income.level}</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{income.percentage}%</td>
                  <td style={{ fontWeight: 600, color: '#c5a059', fontFamily: 'monospace' }}>
                    + ₹{Number(income.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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
