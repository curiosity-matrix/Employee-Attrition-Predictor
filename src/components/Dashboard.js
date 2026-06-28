import React, { useEffect, useRef, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, LineChart, Line, CartesianGrid
} from 'recharts';

const PURPLE = '#7F77DD';
const RED    = '#D85A30';
const TEAL   = '#1D9E75';
const AMBER  = '#BA7517';
const DARK   = '#1a1a28';

const deptData = [
  { name: 'Sales', rate: 20.6 },
  { name: 'HR', rate: 19.0 },
  { name: 'R&D', rate: 13.8 },
];

const ageData = [
  { age: '18–25', rate: 37 },
  { age: '26–35', rate: 20 },
  { age: '36–45', rate: 14 },
  { age: '46–55', rate: 9 },
  { age: '55+',   rate: 6 },
];

const travelData = [
  { name: 'Frequent', rate: 24.9 },
  { name: 'Rarely',   rate: 15.0 },
  { name: 'No travel', rate: 8.0 },
];

const pieData = [
  { name: 'Retained (No)', value: 1233 },
  { name: 'Left (Yes)',     value: 237 },
];
const PIE_COLORS = [TEAL, RED];

const metricsData = [
  { metric: 'Accuracy', value: 83 },
  { metric: 'Precision (0)', value: 89 },
  { metric: 'Recall (0)',    value: 91 },
  { metric: 'F1 (0)',        value: 90 },
  { metric: 'Precision (1)', value: 46 },
  { metric: 'Recall (1)',    value: 40 },
  { metric: 'F1 (1)',        value: 43 },
];

const trainingData = [
  { epoch: 1,  trainLoss: 0.68, valLoss: 0.70 },
  { epoch: 5,  trainLoss: 0.55, valLoss: 0.58 },
  { epoch: 10, trainLoss: 0.44, valLoss: 0.47 },
  { epoch: 20, trainLoss: 0.36, valLoss: 0.40 },
  { epoch: 30, trainLoss: 0.31, valLoss: 0.36 },
  { epoch: 40, trainLoss: 0.28, valLoss: 0.34 },
  { epoch: 50, trainLoss: 0.26, valLoss: 0.33 },
  { epoch: 60, trainLoss: 0.25, valLoss: 0.33 },
];

function Card({ title, children, style }) {
  return (
    <div style={{
      background: DARK, border: '1px solid rgba(83,74,183,0.2)',
      borderRadius: 12, padding: 20, ...style
    }}>
      {title && <div style={{ fontSize: 13, color: '#8888a8', marginBottom: 16, fontWeight: 500 }}>{title}</div>}
      {children}
    </div>
  );
}

function StatCard({ val, lbl, color }) {
  return (
    <div style={{
      background: DARK, border: '1px solid rgba(83,74,183,0.2)',
      borderRadius: 12, padding: '18px 20px', textAlign: 'center'
    }}>
      <div style={{ fontSize: 28, fontWeight: 600, color: color || '#e8e8f0', marginBottom: 4 }}>{val}</div>
      <div style={{ fontSize: 12, color: '#6868888' }}>{lbl}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#12121c', border: '1px solid rgba(83,74,183,0.4)', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#e8e8f0' }}>
        <div style={{ color: '#9D97E8', marginBottom: 4 }}>{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}{p.name?.includes('rate') || p.name === 'value' ? '' : '%'}</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [visible, setVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ padding: '80px 48px', background: '#0d0d12', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 12, color: '#7F77DD', fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Analytics</div>
          <h2 style={{ fontSize: 36, fontWeight: 600, color: '#f0f0f8' }}>Dataset overview</h2>
          <p style={{ fontSize: 14, color: '#6868888', marginTop: 8 }}>IBM HR Analytics Employee Attrition dataset — 1,470 records, 35 features</p>
        </div>

        {/* Stat row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          <StatCard val="1,470" lbl="Total employees"  color={PURPLE} />
          <StatCard val="237"   lbl="Left (attrition)" color={RED} />
          <StatCard val="1,233" lbl="Retained"          color={TEAL} />
          <StatCard val="16.1%" lbl="Attrition rate"    color={AMBER} />
        </div>

        {/* Charts row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Card title="Attrition rate by department (%)">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={deptData} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" domain={[0, 25]} tick={{ fill: '#6868888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#a0a0b8', fontSize: 12 }} axisLine={false} tickLine={false} width={50} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name="Attrition rate" radius={[0, 4, 4, 0]}>
                  {deptData.map((_, i) => <Cell key={i} fill={[RED, AMBER, PURPLE][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Attrition by age group (%)">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={ageData} margin={{ left: -10, right: 10 }}>
                <XAxis dataKey="age" tick={{ fill: '#a0a0b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6868888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name="Attrition rate" radius={[4, 4, 0, 0]}>
                  {ageData.map((_, i) => <Cell key={i} fill={i === 0 ? RED : i === 1 ? AMBER : PURPLE} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Card title="Class distribution">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#a0a0b8' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Business travel impact (%)">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={travelData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis type="number" tick={{ fill: '#6868888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#a0a0b8', fontSize: 11 }} axisLine={false} tickLine={false} width={65} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rate" name="Attrition rate" radius={[0, 4, 4, 0]}>
                  {travelData.map((_, i) => <Cell key={i} fill={[RED, AMBER, TEAL][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Overtime effect">
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: 180, gap: 16 }}>
              {[
                { label: 'Overtime: Yes', rate: 30.5, color: RED },
                { label: 'Overtime: No',  rate: 10.4, color: TEAL },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#a0a0b8', marginBottom: 6 }}>
                    <span>{item.label}</span><span style={{ color: item.color, fontWeight: 500 }}>{item.rate}%</span>
                  </div>
                  <div style={{ height: 10, background: '#2a2a38', borderRadius: 5, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 5, background: item.color,
                      width: visible ? `${item.rate * 3}%` : '0%',
                      transition: 'width 1.2s ease',
                    }} />
                  </div>
                </div>
              ))}
              <p style={{ fontSize: 11, color: '#606078', marginTop: 8, lineHeight: 1.5 }}>
                Overtime is the strongest single predictor — employees who work overtime are 3× more likely to leave.
              </p>
            </div>
          </Card>
        </div>

        {/* Model metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Card title="Model classification metrics">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={metricsData} margin={{ left: -10, right: 10 }}>
                <XAxis dataKey="metric" tick={{ fill: '#a0a0b8', fontSize: 10 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" height={40} />
                <YAxis domain={[0, 100]} tick={{ fill: '#6868888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Score %" radius={[4, 4, 0, 0]}>
                  {metricsData.map((d, i) => <Cell key={i} fill={d.value >= 80 ? TEAL : d.value >= 60 ? PURPLE : d.value >= 40 ? AMBER : RED} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card title="Training loss curve (simulated from history)">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trainingData} margin={{ left: -10, right: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="epoch" tick={{ fill: '#a0a0b8', fontSize: 11 }} axisLine={false} tickLine={false} label={{ value: 'Epoch', position: 'insideBottom', offset: -2, fill: '#606078', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6868888', fontSize: 11 }} axisLine={false} tickLine={false} domain={[0.2, 0.75]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="trainLoss" name="Train loss" stroke={PURPLE} strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="valLoss"   name="Val loss"   stroke={AMBER}  strokeWidth={2} dot={false} strokeDasharray="5 3" />
                <Legend wrapperStyle={{ fontSize: 11, color: '#a0a0b8' }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </div>
  );
}
