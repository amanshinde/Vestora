import { useState, useEffect } from 'react';
import { createInvestment, getInvestments } from '../api/investment.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Pagination from '../components/common/Pagination.jsx';

const PLANS = [
  { name: 'Starter', minAmount: 1000, maxAmount: 10000, dailyROI: '1.0%', duration: '30 days' },
  { name: 'Growth', minAmount: 10001, maxAmount: 50000, dailyROI: '1.5%', duration: '60 days' },
  { name: 'Premium', minAmount: 50001, maxAmount: null, dailyROI: '2.0%', duration: '90 days' },
];

const InvestmentsPage = () => {
  const { refreshUser } = useAuth();
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
      setError(err.response?.data?.message || 'Failed to load portfolio allocations');
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
      refreshUser();
      setFormSuccess('Capital allocation deployed successfully.');
      setFormData({ amount: '', planName: 'Starter' });
      setShowForm(false);
      fetchInvestments(1);
      setPage(1);
      setTimeout(() => setFormSuccess(''), 4000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to initialize capital term');
    } finally {
      setFormLoading(false);
    }
  };

  const selectedPlan = PLANS.find((p) => p.name === formData.planName);

  return (
    <div className="fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Capital Allocations</h1>
          <p className="page-subtitle">Manage term investments and monitor daily yield processing</p>
        </div>
        <button className={showForm ? 'btn btn-secondary' : 'btn btn-primary'} onClick={() => setShowForm(!showForm)}>
          <span>{showForm ? 'Cancel Term' : 'Deploy New Capital'}</span>
        </button>
      </div>

      {formSuccess && <div className="alert alert-success"><span>{formSuccess}</span></div>}

      {/* Investment Form */}
      {showForm && (
        <div className="glass-card scale-in" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#121216' }}>
          <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.07)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h3 className="section-title">Select Capital Term & Allocation</h3>
          </div>

          {/* Plan Selection */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            {PLANS.map((plan) => {
              const isSelected = formData.planName === plan.name;
              return (
                <div
                  key={plan.name}
                  onClick={() => setFormData({ ...formData, planName: plan.name })}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '6px',
                    border: `1px solid ${isSelected ? '#c5a059' : 'rgba(255,255,255,0.07)'}`,
                    background: isSelected ? 'rgba(197, 160, 89, 0.06)' : '#16161a',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                  }}
                >
                  {isSelected && (
                    <span style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.65rem', fontFamily: 'monospace', color: '#c5a059', letterSpacing: '0.1em' }}>
                      ● SELECTED
                    </span>
                  )}
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fbfaf6', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif" }}>{plan.name}</p>
                  <div style={{ display: 'flex', gap: '1rem', margin: '0.75rem 0' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#757582', display: 'block', textTransform: 'uppercase' }}>Daily ROI</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#10b981', fontFamily: 'monospace' }}>{plan.dailyROI}</span>
                    </div>
                    <div>
                      <span style={{ fontSize: '0.7rem', color: '#757582', display: 'block', textTransform: 'uppercase' }}>Term</span>
                      <span style={{ fontSize: '0.95rem', fontWeight: 500, color: '#fbfaf6' }}>{plan.duration}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#a1a1aa', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem', margin: 0, fontFamily: 'monospace' }}>
                    Range: ₹{plan.minAmount.toLocaleString()}{plan.maxAmount ? ` – ₹${plan.maxAmount.toLocaleString()}` : '+'}
                  </p>
                </div>
              );
            })}
          </div>

          {formError && <div className="alert alert-error"><span>{formError}</span></div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ maxWidth: '400px' }}>
              <label htmlFor="invest-amount" className="form-label">
                Allocation Amount (₹ INR)
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
            <button type="submit" className="btn btn-primary" disabled={formLoading} style={{ marginTop: '0.5rem' }}>
              <span>{formLoading ? 'Executing Protocol...' : 'Deploy Capital Term'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Investments Table */}
      {error ? (
        <div className="alert alert-error"><span>{error}</span></div>
      ) : loading ? (
        <Loader text="Retrieving term allocations..." />
      ) : investments.length === 0 ? (
        <div className="glass-card">
          <EmptyState
            symbol="◇"
            title="No active allocations deployed"
            text="Deploy a Starter, Growth, or Premium term to start accumulating automated midnight yields."
          />
        </div>
      ) : (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Term Plan</th>
                <th>Principal Allocated</th>
                <th>Daily Yield Rate</th>
                <th>Duration</th>
                <th>Inception Date</th>
                <th>Maturity Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => (
                <tr key={inv._id}>
                  <td style={{ fontWeight: 600, color: '#fbfaf6' }}>{inv.plan.name}</td>
                  <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>₹{Number(inv.amount).toLocaleString('en-IN')}</td>
                  <td style={{ color: '#10b981', fontFamily: 'monospace', fontWeight: 600 }}>{inv.plan.dailyROIPercentage}%</td>
                  <td>{inv.plan.durationDays} days</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{new Date(inv.startDate).toLocaleDateString()}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{new Date(inv.endDate).toLocaleDateString()}</td>
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
