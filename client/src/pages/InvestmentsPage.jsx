import { useState, useEffect } from 'react';
import { createInvestment, getInvestments } from '../api/investment.api.js';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';

const PLANS = [
  { name: 'Starter', minAmount: 1000, maxAmount: 10000, dailyROI: '1%', duration: '30 days' },
  { name: 'Growth', minAmount: 10001, maxAmount: 50000, dailyROI: '1.5%', duration: '60 days' },
  { name: 'Premium', minAmount: 50001, maxAmount: null, dailyROI: '2%', duration: '90 days' },
];

const InvestmentsPage = () => {
  const [investments, setInvestments] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  // Investment form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ amount: '', planName: 'Starter' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState('');

  const fetchInvestments = async (pageNum = 1) => {
    try {
      setLoading(true);
      const res = await getInvestments({ page: pageNum, limit: 10 });
      setInvestments(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load investments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInvestments(page); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');

    try {
      await createInvestment({
        amount: Number(formData.amount),
        planName: formData.planName,
      });
      setFormSuccess('Investment created successfully!');
      setFormData({ amount: '', planName: 'Starter' });
      setShowForm(false);
      fetchInvestments(1);
      setPage(1);
      setTimeout(() => setFormSuccess(''), 3000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create investment');
    } finally {
      setFormLoading(false);
    }
  };

  const selectedPlan = PLANS.find((p) => p.name === formData.planName);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Investments</h1>
          <p className="page-subtitle">Manage your investment portfolio</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Cancel' : '+ New Investment'}
        </button>
      </div>

      {formSuccess && <div className="alert alert-success">✅ {formSuccess}</div>}

      {/* Investment Form */}
      {showForm && (
        <div className="glass-card scale-in" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 className="section-title" style={{ marginBottom: '1rem' }}>Create Investment</h3>

          {/* Plan Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                onClick={() => setFormData({ ...formData, planName: plan.name })}
                style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${formData.planName === plan.name ? 'var(--color-accent-primary)' : 'var(--color-border)'}`,
                  background: formData.planName === plan.name ? 'rgba(99,102,241,0.08)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <p style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>{plan.name}</p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  {plan.dailyROI} daily · {plan.duration}
                </p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                  ₹{plan.minAmount.toLocaleString()}{plan.maxAmount ? ` - ₹${plan.maxAmount.toLocaleString()}` : '+'}
                </p>
              </div>
            ))}
          </div>

          {formError && <div className="alert alert-error">⚠️ {formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="invest-amount" className="form-label">
                Investment Amount (₹)
              </label>
              <input
                id="invest-amount"
                type="number"
                className="form-input"
                placeholder={`Min ₹${selectedPlan?.minAmount?.toLocaleString()}`}
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                min={selectedPlan?.minAmount}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? 'Processing...' : 'Invest Now'}
            </button>
          </form>
        </div>
      )}

      {/* Investments Table */}
      {error ? (
        <div className="alert alert-error">⚠️ {error}</div>
      ) : loading ? (
        <Loader text="Loading investments..." />
      ) : investments.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            icon="💰"
            title="No investments yet"
            text="Start investing to see your portfolio here."
          />
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Amount</th>
                <th>Daily ROI</th>
                <th>Duration</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => (
                <tr key={inv._id}>
                  <td style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{inv.plan.name}</td>
                  <td>₹{Number(inv.amount).toLocaleString('en-IN')}</td>
                  <td>{inv.plan.dailyROIPercentage}%</td>
                  <td>{inv.plan.durationDays} days</td>
                  <td>{new Date(inv.startDate).toLocaleDateString()}</td>
                  <td>{new Date(inv.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge badge-${inv.status.toLowerCase()}`}>
                      {inv.status}
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

export default InvestmentsPage;
