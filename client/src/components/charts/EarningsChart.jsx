import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.95)',
      border: '1px solid rgba(99, 102, 241, 0.2)',
      borderRadius: '8px',
      padding: '12px 16px',
      backdropFilter: 'blur(8px)',
    }}>
      <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px' }}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color, fontSize: '13px', fontWeight: 600, margin: '2px 0' }}>
          {entry.name}: ₹{Number(entry.value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
      ))}
    </div>
  );
};

const EarningsChart = ({ data = [] }) => {
  if (data.length === 0) {
    return (
      <div className="glass-card chart-container">
        <h3 className="section-title" style={{ marginBottom: '1rem' }}>📈 Earnings Overview</h3>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No earnings data yet</h3>
          <p className="empty-state-text">Earnings will appear here once your investments start generating ROI.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card chart-container">
      <h3 className="section-title" style={{ marginBottom: '1.5rem' }}>📈 Earnings Overview</h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="referralGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={36}
            formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="roiEarnings"
            name="ROI Earnings"
            stroke="#6366f1"
            fill="url(#roiGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="referralEarnings"
            name="Referral Income"
            stroke="#06b6d4"
            fill="url(#referralGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
