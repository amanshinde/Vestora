import { useState, useEffect } from 'react';
import { getDirectReferrals, getReferralTree } from '../api/referral.api.js';
import { useAuth } from '../context/AuthContext.jsx';
import ReferralTree from '../components/referrals/ReferralTree.jsx';
import Loader from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';

const ReferralsPage = () => {
  const { user } = useAuth();
  const [directReferrals, setDirectReferrals] = useState([]);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('direct');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [directRes, treeRes] = await Promise.all([
          getDirectReferrals(),
          getReferralTree(),
        ]);
        setDirectReferrals(directRes.data.data);
        setTree(treeRes.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load referrals');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyReferralLink = () => {
    const link = `${window.location.origin}/register?ref=${user?.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Loader text="Loading referrals..." />;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Referrals</h1>
        <p className="page-subtitle">Grow your network and earn multi-level income</p>
      </div>

      {/* Referral Link Card */}
      <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>
              Your Referral Code
            </h3>
            <p style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, color: 'var(--color-accent-primary-light)', margin: 0, fontFamily: 'monospace' }}>
              {user?.referralCode}
            </p>
          </div>
          <button className="btn btn-primary" onClick={copyReferralLink}>
            {copied ? '✅ Copied!' : '📋 Copy Referral Link'}
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error">⚠️ {error}</div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <button
          className={`btn ${activeTab === 'direct' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('direct')}
        >
          👤 Direct Referrals ({directReferrals.length})
        </button>
        <button
          className={`btn ${activeTab === 'tree' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('tree')}
        >
          🌳 Referral Tree
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'direct' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {directReferrals.length === 0 ? (
            <EmptyState
              icon="👥"
              title="No referrals yet"
              text="Share your referral code to invite others and earn multi-level income."
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Code</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {directReferrals.map((ref) => (
                  <tr key={ref._id}>
                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{ref.fullName}</td>
                    <td>{ref.email}</td>
                    <td>{ref.mobile}</td>
                    <td><code style={{ color: 'var(--color-accent-primary-light)' }}>{ref.referralCode}</code></td>
                    <td>{new Date(ref.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'tree' && (
        <div className="glass-card" style={{ padding: '1rem' }}>
          {tree.length === 0 ? (
            <EmptyState
              icon="🌳"
              title="No referral tree yet"
              text="Your multi-level referral hierarchy will appear here."
            />
          ) : (
            <ReferralTree tree={tree} />
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
