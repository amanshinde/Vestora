import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div style={{
      background: '#121216',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      borderRadius: '6px',
      padding: '12px 16px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.8)',
    }}>
      <p style={{ color: '#757582', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', fontFamily: 'monospace' }}>{label}</p>
      {payload.map((entry, index) => (
        <p key={index} style={{ color: entry.color, fontSize: '13px', fontWeight: 600, margin: '4px 0', fontFamily: 'monospace' }}>
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
        <h3 className="section-title" style={{ marginBottom: '1rem' }}>Yield & Network Performance (30 Days)</h3>
        <div className="empty-state">
          <div className="empty-state-symbol">◇</div>
          <h3 className="empty-state-title">No telemetry recorded yet</h3>
          <p className="empty-state-text">Performance distribution curves will appear here once capital terms complete their daily processing schedule.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card chart-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <h3 className="section-title">Yield & Network Performance (30 Days)</h3>
        <span style={{ fontSize: '0.75rem', color: '#10b981', fontFamily: 'monospace' }}>● AUDITED LEDGER FEED</span>
      </div>
      
      <ResponsiveContainer width="100%" height={340}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c5a059" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#c5a059" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="referralGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fill: '#757582', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={{ stroke: 'rgba(255, 255, 255, 0.08)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#757582', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="top"
            height={40}
            formatter={(value) => <span style={{ color: '#c2c2cc', fontSize: '12px', fontWeight: 500, marginRight: '16px' }}>{value}</span>}
          />
          <Area
            type="monotone"
            dataKey="roiEarnings"
            name="ROI Earnings"
            stroke="#c5a059"
            fill="url(#roiGradient)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="referralEarnings"
            name="Network Yield"
            stroke="#10b981"
            fill="url(#referralGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsChart;
