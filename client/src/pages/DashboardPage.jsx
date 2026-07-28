import { useState, useEffect } from 'react';
import { getDashboardSummary, getEarnings } from '../api/dashboard.api.js';
import EarningsChart from '../components/charts/EarningsChart.jsx';
import Loader from '../components/common/Loader.jsx';

const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

const StatCard = ({ icon, bgClass, accentClass, label, value }) => (
  <div className={`glass-card stat-card ${accentClass}`}>
    <div className={`stat-icon ${bgClass}`}>{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
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
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loader text="Loading dashboard..." />;

  if (error) {
    return (
      <div className="fade-in">
        <div className="alert alert-error">⚠️ {error}</div>
      </div>
    );
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Your investment overview at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid stagger-children">
        <StatCard
          icon="💰"
          bgClass="bg-primary"
          accentClass="accent-primary"
          label="Total Investments"
          value={formatCurrency(summary?.totalInvestments)}
        />
        <StatCard
          icon="📈"
          bgClass="bg-success"
          accentClass="accent-success"
          label="Daily ROI"
          value={formatCurrency(summary?.dailyROI)}
        />
        <StatCard
          icon="🏆"
          bgClass="bg-warning"
          accentClass="accent-warning"
          label="Total ROI Earned"
          value={formatCurrency(summary?.totalROIEarned)}
        />
        <StatCard
          icon="💎"
          bgClass="bg-info"
          accentClass="accent-info"
          label="Total Level Income"
          value={formatCurrency(summary?.totalLevelIncomeEarned)}
        />
        <StatCard
          icon="💳"
          bgClass="bg-success"
          accentClass="accent-success"
          label="Wallet Balance"
          value={formatCurrency(summary?.walletBalance)}
        />
      </div>

      {/* Earnings Chart */}
      <EarningsChart data={earnings} />
    </div>
  );
};

export default DashboardPage;
