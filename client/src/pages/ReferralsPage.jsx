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
        setError(err.response?.data?.message || 'Failed to assemble network topology');
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
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) return <Loader text="Mapping network topology..." />;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">My Network</h1>
        <p className="page-subtitle">Manage direct partners and inspect up to five hierarchical network tiers</p>
      </div>

      {/* Referral Link Card */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem', backgroundColor: '#121216', borderLeft: '3px solid #c5a059' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#757582', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block' }}>
              Member Invitation Key
            </span>
            <p style={{ fontSize: '1.85rem', fontWeight: 700, color: '#c5a059', margin: '0.4rem 0 0', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
              {user?.referralCode || 'UNASSIGNED'}
            </p>
            <span style={{ fontSize: '0.8rem', color: '#a1a1aa', display: 'block', marginTop: '0.4rem' }}>
              New member creations attributed via this key connect immediately into your Level 01 network hierarchy.
            </span>
          </div>
          <button className="btn btn-primary" onClick={copyReferralLink}>
            <span>{copied ? 'Link Copied to Clipboard' : 'Copy Invitation Link'}</span>
          </button>
        </div>
      </div>

      {error && <div className="alert alert-error"><span>{error}</span></div>}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.07)', paddingBottom: '1rem' }}>
        <button
          className={activeTab === 'direct' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('direct')}
          style={{ padding: '0.55rem 1.2rem' }}
        >
          <span>Direct Partners ({directReferrals.length})</span>
        </button>
        <button
          className={activeTab === 'tree' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setActiveTab('tree')}
          style={{ padding: '0.55rem 1.2rem' }}
        >
          <span>Network Hierarchy</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'direct' && (
        <div className="glass-card" style={{ overflow: 'hidden' }}>
          {directReferrals.length === 0 ? (
            <EmptyState
              symbol="◇"
              title="No direct partners connected"
              text="Share your member invitation link to onboard direct partners into your Level 01 network hierarchy."
            />
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Email Address</th>
                  <th>Contact Number</th>
                  <th>Assigned Code</th>
                  <th>Registration Date</th>
                </tr>
              </thead>
              <tbody>
                {directReferrals.map((ref) => (
                  <tr key={ref._id}>
                    <td style={{ fontWeight: 600, color: '#fbfaf6' }}>{ref.fullName}</td>
                    <td style={{ color: '#c2c2cc' }}>{ref.email}</td>
                    <td style={{ fontFamily: 'monospace' }}>{ref.mobile}</td>
                    <td><code style={{ color: '#c5a059', background: 'rgba(197, 160, 89, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{ref.referralCode}</code></td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>{new Date(ref.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'tree' && (
        <div className="glass-card" style={{ padding: '1.5rem', backgroundColor: '#121216' }}>
          {tree.length === 0 ? (
            <EmptyState
              symbol="◇"
              title="Network hierarchy empty"
              text="Your hierarchical multi-tier tree structure will render here once connected members join your ecosystem."
            />
          ) : (
            <div>
              <div style={{ fontSize: '0.75rem', color: '#757582', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
                Interactive Network Tree (Up to 5 Tiers)
              </div>
              <ReferralTree tree={tree} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReferralsPage;
