import { useState, useEffect } from 'react';
import { getDashboardSummary, getEarnings } from '../api/dashboard.api.js';
import EarningsChart from '../components/charts/EarningsChart.jsx';
import Loader from '../components/common/Loader.jsx';

const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const StatCard = ({ label, value, dotColor, subtext }) => (
  <div className="stat-card">
    <div className="stat-header-flex">
      <span className="stat-label">{label}</span>
      <span className={`stat-dot ${dotColor}`}></span>
    </div>
    <div className="stat-value">{value}</div>
    {subtext && <span style={{ fontSize: '0.75rem', color: '#757582', marginTop: '0.5rem', display: 'block' }}>{subtext}</span>}
  </div>
);

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, earningsRes] = await Promise.all([
          getDashboardSummary(),
          getEarnings({ days: 30 }),
        ]);
        setSummary(summaryRes.data.data);
        setEarnings(earningsRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to initialize terminal data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Synchronizing member portfolio..." />;

  if (error) {
    return (
      <div className="fade-in">
        <div className="alert alert-error"><span>{error}</span></div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Member Portfolio</h1>
        <p className="page-subtitle">Real-time valuation and multi-stream yield telemetry</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stagger-children">
        <StatCard
          label="Total Allocations"
          value={formatCurrency(summary?.totalInvestments)}
          dotColor="gold"
          subtext="Active capital terms"
        />
        <StatCard
          label="Daily Projected Yield"
          value={formatCurrency(summary?.dailyROI)}
          dotColor="emerald"
          subtext="Next midnight processing"
        />
        <StatCard
          label="Cumulative ROI Generated"
          value={formatCurrency(summary?.totalROIEarned)}
          dotColor="gold"
          subtext="Verified zero-truncation"
        />
        <StatCard
          label="Network Yield Earned"
          value={formatCurrency(summary?.totalLevelIncomeEarned)}
          dotColor="blue"
          subtext="Across 5 connected tiers"
        />
        <StatCard
          label="Liquid Wallet Balance"
          value={formatCurrency(summary?.walletBalance)}
          dotColor="emerald"
          subtext="Available for deployment"
        />
      </div>

      {/* Earnings Chart */}
      <EarningsChart data={earnings} />
    </div>
  );
};

export default DashboardPage;
