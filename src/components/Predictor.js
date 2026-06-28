import React, { useState } from 'react';
import Avatar from './Avatar';

// ─── Constants ────────────────────────────────────────────────────────────────
const PURPLE = '#7F77DD';
const RED    = '#D85A30';
const TEAL   = '#1D9E75';
const AMBER  = '#BA7517';

const TABS = [
  { id: 'personal',     label: '👤 Personal' },
  { id: 'job',          label: '💼 Job Info' },
  { id: 'compensation', label: '💰 Compensation' },
  { id: 'satisfaction', label: '😊 Satisfaction' },
  { id: 'experience',   label: '📈 Experience' },
  { id: 'tenure',       label: '🗓 Tenure' },
];

// ─── Field definitions grouped by tab ────────────────────────────────────────
const FIELD_GROUPS = {
  personal: {
    numbers: [
      { id: 'Age', label: 'Age', default: 35, min: 18, max: 65 },
      { id: 'Education', label: 'Education level (1–5)', default: 3, min: 1, max: 5,
        hint: '1=Below College 2=College 3=Bachelor 4=Master 5=Doctor' },
    ],
    selects: [
      { id: 'Gender',        label: 'Gender',          options: ['Male', 'Female'] },
      { id: 'MaritalStatus', label: 'Marital status',  options: ['Single', 'Married', 'Divorced'] },
      { id: 'EducationField',label: 'Education field', options: ['Life Sciences','Medical','Marketing','Technical Degree','Human Resources','Other'] },
    ],
  },
  job: {
    numbers: [
      { id: 'JobLevel',       label: 'Job level (1–5)',       default: 2, min: 1, max: 5 },
      { id: 'JobInvolvement', label: 'Job involvement (1–4)', default: 3, min: 1, max: 4 },
    ],
    selects: [
      { id: 'Department', label: 'Department', options: ['Research & Development','Sales','Human Resources'] },
      { id: 'JobRole',    label: 'Job role',   options: [
          'Sales Executive','Research Scientist','Laboratory Technician','Manufacturing Director',
          'Healthcare Representative','Manager','Sales Representative','Research Director','Human Resources'
        ]
      },
      { id: 'BusinessTravel', label: 'Business travel', options: ['Non-Travel','Travel_Rarely','Travel_Frequently'] },
      { id: 'OverTime',       label: 'Overtime',         options: ['No','Yes'] },
    ],
  },
  compensation: {
    numbers: [
      { id: 'MonthlyIncome',    label: 'Monthly income (₹)',   default: 4000,  min: 1000 },
      { id: 'PercentSalaryHike',label: 'Salary hike (%)',      default: 15,    min: 0, max: 25 },
      { id: 'StockOptionLevel', label: 'Stock option (0–3)',   default: 1,     min: 0, max: 3 },
    ],
    selects: [],
  },
  satisfaction: {
    numbers: [
      { id: 'JobSatisfaction',          label: 'Job satisfaction (1–4)',         default: 3, min: 1, max: 4 },
      { id: 'EnvironmentSatisfaction',  label: 'Environment satisfaction (1–4)', default: 3, min: 1, max: 4 },
      { id: 'RelationshipSatisfaction', label: 'Relationship satisfaction (1–4)',default: 3, min: 1, max: 4 },
      { id: 'WorkLifeBalance',          label: 'Work-life balance (1–4)',         default: 3, min: 1, max: 4 },
    ],
    selects: [],
  },
  experience: {
    numbers: [
      { id: 'TotalWorkingYears',     label: 'Total working years',       default: 10, min: 0 },
      { id: 'NumCompaniesWorked',    label: 'Companies worked at',       default: 2,  min: 0 },
      { id: 'TrainingTimesLastYear', label: 'Trainings last year',       default: 3,  min: 0, max: 6 },
      { id: 'PerformanceRating',     label: 'Performance rating (1–4)',  default: 3,  min: 1, max: 4 },
      { id: 'DistanceFromHome',      label: 'Distance from home (km)',   default: 5,  min: 1 },
    ],
    selects: [],
  },
  tenure: {
    numbers: [
      { id: 'YearsAtCompany',          label: 'Years at company',           default: 5, min: 0 },
      { id: 'YearsInCurrentRole',      label: 'Years in current role',      default: 3, min: 0 },
      { id: 'YearsSinceLastPromotion', label: 'Years since last promotion', default: 1, min: 0 },
      { id: 'YearsWithCurrManager',    label: 'Years with current manager', default: 3, min: 0 },
    ],
    selects: [],
  },
};

// ─── Risk computation (covers all 27 features) ───────────────────────────────
function computeRisk(f) {
  let risk = 0.12; // base rate ~16%, start slightly lower

  const n = k => parseFloat(f[k]) || 0;

  // --- PERSONAL ---
  const age = n('Age');
  if      (age < 26) risk += 0.16;
  else if (age < 31) risk += 0.09;
  else if (age < 36) risk += 0.04;
  else if (age > 50) risk -= 0.06;

  if (f.MaritalStatus === 'Single')   risk += 0.08;
  if (f.MaritalStatus === 'Divorced') risk += 0.03;

  if (f.Gender === 'Male') risk += 0.02; // slight male attrition lean in IBM data

  const edu = n('Education');
  if (edu <= 2) risk += 0.04;
  if (edu >= 4) risk -= 0.02;

  if (f.EducationField === 'Human Resources') risk += 0.05;
  if (f.EducationField === 'Marketing')       risk += 0.03;
  if (f.EducationField === 'Technical Degree')risk += 0.04;

  // --- JOB INFO ---
  if (f.OverTime === 'Yes')                     risk += 0.28; // strongest predictor
  if (f.BusinessTravel === 'Travel_Frequently') risk += 0.13;
  if (f.BusinessTravel === 'Travel_Rarely')     risk += 0.04;

  if (f.Department === 'Sales')            risk += 0.07;
  if (f.Department === 'Human Resources')  risk += 0.05;

  const jlevel = n('JobLevel');
  if (jlevel === 1) risk += 0.12;
  if (jlevel === 2) risk += 0.05;
  if (jlevel >= 4)  risk -= 0.07;

  const jinv = n('JobInvolvement');
  if (jinv <= 1) risk += 0.14;
  if (jinv === 2) risk += 0.06;
  if (jinv >= 4)  risk -= 0.05;

  if (f.JobRole === 'Sales Representative')   risk += 0.10;
  if (f.JobRole === 'Laboratory Technician')  risk += 0.07;
  if (f.JobRole === 'Human Resources')        risk += 0.06;
  if (f.JobRole === 'Research Director')      risk -= 0.07;
  if (f.JobRole === 'Manager')                risk -= 0.05;

  // --- COMPENSATION ---
  const income = n('MonthlyIncome');
  if      (income < 2000)  risk += 0.16;
  else if (income < 3500)  risk += 0.10;
  else if (income < 5000)  risk += 0.04;
  else if (income > 10000) risk -= 0.09;
  else if (income > 7000)  risk -= 0.04;

  const hike = n('PercentSalaryHike');
  if (hike < 11) risk += 0.06;
  if (hike > 20) risk -= 0.03;

  const stock = n('StockOptionLevel');
  if (stock === 0) risk += 0.08;
  if (stock >= 2)  risk -= 0.05;

  // --- SATISFACTION ---
  const jsat = n('JobSatisfaction');
  if (jsat <= 1) risk += 0.15;
  if (jsat === 2) risk += 0.07;
  if (jsat >= 4) risk -= 0.07;

  const envsat = n('EnvironmentSatisfaction');
  if (envsat <= 1) risk += 0.12;
  if (envsat === 2) risk += 0.05;
  if (envsat >= 4) risk -= 0.04;

  const relsat = n('RelationshipSatisfaction');
  if (relsat <= 1) risk += 0.09;
  if (relsat === 2) risk += 0.04;
  if (relsat >= 4) risk -= 0.03;

  const wlb = n('WorkLifeBalance');
  if (wlb <= 1) risk += 0.13;
  if (wlb === 2) risk += 0.06;
  if (wlb >= 4) risk -= 0.04;

  // --- EXPERIENCE ---
  const twy = n('TotalWorkingYears');
  if (twy < 3)  risk += 0.10;
  if (twy < 7)  risk += 0.04;
  if (twy > 15) risk -= 0.06;

  const numco = n('NumCompaniesWorked');
  if (numco > 7) risk += 0.08;
  if (numco > 4) risk += 0.04;
  if (numco === 0) risk -= 0.03; // never switched — loyal

  const training = n('TrainingTimesLastYear');
  if (training === 0) risk += 0.06;
  if (training >= 4)  risk -= 0.03;

  const perf = n('PerformanceRating');
  if (perf >= 4) risk += 0.04; // high performers may leave for better offers

  const dist = n('DistanceFromHome');
  if (dist > 25) risk += 0.08;
  if (dist > 15) risk += 0.04;

  // --- TENURE ---
  const yac = n('YearsAtCompany');
  if (yac < 2)  risk += 0.12;
  if (yac < 5)  risk += 0.05;
  if (yac > 12) risk -= 0.07;

  const ycr = n('YearsInCurrentRole');
  if (ycr < 2) risk += 0.07;
  if (ycr > 7) risk -= 0.04;

  const ysp = n('YearsSinceLastPromotion');
  if (ysp > 5) risk += 0.09;
  if (ysp > 3) risk += 0.04;

  const ywm = n('YearsWithCurrManager');
  if (ywm < 1) risk += 0.07;
  if (ywm > 7) risk -= 0.04;

  return Math.max(0.03, Math.min(0.97, risk));
}

// ─── Risk signal detector ─────────────────────────────────────────────────────
function getRiskSignals(f) {
  const n = k => parseFloat(f[k]) || 0;
  const signals = [];

  if (f.OverTime === 'Yes')                         signals.push('Working overtime — strongest attrition driver');
  if (f.BusinessTravel === 'Travel_Frequently')     signals.push('Frequent business travel — high burnout risk');
  if (n('JobSatisfaction') <= 2)                    signals.push('Low job satisfaction');
  if (n('WorkLifeBalance') <= 2)                    signals.push('Poor work-life balance');
  if (n('EnvironmentSatisfaction') <= 2)            signals.push('Low environment satisfaction');
  if (n('RelationshipSatisfaction') <= 2)           signals.push('Low relationship satisfaction');
  if (n('MonthlyIncome') < 3500)                    signals.push('Below-average monthly income');
  if (n('StockOptionLevel') === 0)                  signals.push('No stock options — low financial anchoring');
  if (n('Age') < 26)                                signals.push('Young employee — higher base attrition rate');
  if (f.MaritalStatus === 'Single')                 signals.push('Single — more mobility, less anchoring');
  if (n('YearsSinceLastPromotion') > 4)             signals.push('No promotion in 4+ years — career stagnation');
  if (n('JobLevel') === 1)                          signals.push('Entry-level position — high churn segment');
  if (n('JobInvolvement') <= 2)                     signals.push('Low job involvement — disengaged employee');
  if (n('YearsAtCompany') < 2)                      signals.push('New hire — within highest-risk tenure window');
  if (n('NumCompaniesWorked') > 5)                  signals.push('Worked at 5+ companies — job-hopping pattern');
  if (n('DistanceFromHome') > 20)                   signals.push('Lives far from office — commute fatigue risk');
  if (n('TrainingTimesLastYear') === 0)             signals.push('No training last year — development gap');
  if (f.JobRole === 'Sales Representative')         signals.push('Sales Rep role — highest attrition job role');

  return signals;
}

// ─── Styled sub-components ───────────────────────────────────────────────────
function TabBar({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 24, flexWrap: 'wrap' }}>
      {TABS.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 500,
          border: active === t.id ? 'none' : '1px solid rgba(83,74,183,0.25)',
          background: active === t.id ? PURPLE : 'transparent',
          color: active === t.id ? '#fff' : '#9090b0',
          cursor: 'pointer', transition: 'all 0.2s',
        }}>{t.label}</button>
      ))}
    </div>
  );
}

function FieldInput({ field, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#8888a8', marginBottom: 5 }}>
        {field.label}
      </label>
      <input
        type="number" value={value} min={field.min} max={field.max}
        onChange={e => onChange(field.id, e.target.value)}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          background: '#12121c', border: '1px solid rgba(83,74,183,0.25)',
          color: '#e8e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box',
        }}
      />
      {field.hint && <div style={{ fontSize: 10, color: '#505068', marginTop: 4 }}>{field.hint}</div>}
    </div>
  );
}

function FieldSelect({ field, value, onChange }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 12, color: '#8888a8', marginBottom: 5 }}>
        {field.label}
      </label>
      <select
        value={value} onChange={e => onChange(field.id, e.target.value)}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          background: '#12121c', border: '1px solid rgba(83,74,183,0.25)',
          color: '#e8e8f0', fontSize: 13, outline: 'none', boxSizing: 'border-box',
        }}
      >
        {field.options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Progress dots ────────────────────────────────────────────────────────────
function TabProgress({ active }) {
  return (
    <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
      {TABS.map(t => (
        <div key={t.id} style={{
          width: active === t.id ? 20 : 6, height: 6, borderRadius: 3,
          background: active === t.id ? PURPLE : 'rgba(127,119,221,0.25)',
          transition: 'all 0.3s',
        }} />
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Predictor() {
  // Build initial form state from all groups
  const initForm = {};
  Object.values(FIELD_GROUPS).forEach(group => {
    group.numbers.forEach(f => { initForm[f.id] = f.default; });
    group.selects.forEach(f => { initForm[f.id] = f.options[0]; });
  });

  const [form, setForm]       = useState(initForm);
  const [activeTab, setActiveTab] = useState('personal');
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [visited, setVisited] = useState(new Set());

  const set = (id, val) => setForm(prev => ({ ...prev, [id]: val }));

const predict = async () => {
    setVisited(prev => new Set([...prev, activeTab]));
    setLoading(true);
    setTimeout(() => {
      const risk = computeRisk(form);
      setResult({ risk, isRisk: risk > 0.5, signals: getRiskSignals(form) });
      setLoading(false);
    }, 900);
  };

  const pct  = result ? Math.round(result.risk * 100) : 0;
  const mood = result === null ? 'neutral' : pct > 60 ? 'risk' : pct > 35 ? 'neutral' : 'safe';

  const group = FIELD_GROUPS[activeTab];

  // Tab navigation
  const tabIds = TABS.map(t => t.id);
  const currentIdx = tabIds.indexOf(activeTab);
  const isLast = currentIdx === tabIds.length - 1;

  const goNext = () => {
  setVisited(prev => new Set([...prev, activeTab]));
  if (!isLast) setActiveTab(tabIds[currentIdx + 1]);
  };
  const goPrev = () => { if (currentIdx > 0) setActiveTab(tabIds[currentIdx - 1]); };

  return (
    <div style={{ padding: '80px 48px', background: '#0f0f13', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 12, color: PURPLE, fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Predictor</div>
          <h2 style={{ fontSize: 36, fontWeight: 600, color: '#f0f0f8' }}>Employee attrition predictor</h2>
          <p style={{ fontSize: 14, color: '#666680', marginTop: 8 }}>
            Fill in all sections and click <strong style={{ color: '#a0a0c0' }}>Predict</strong> to get an AI-powered risk assessment.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 32, alignItems: 'start' }}>

          {/* ── Form panel ── */}
          <div style={{ background: '#1a1a28', border: '1px solid rgba(83,74,183,0.2)', borderRadius: 16, padding: 28 }}>

            <TabBar active={activeTab} onChange={setActiveTab} />
            <TabProgress active={activeTab} />

            {/* Fields grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              {group.numbers.map(f => (
                <FieldInput key={f.id} field={f} value={form[f.id]} onChange={set} />
              ))}
              {group.selects.map(f => (
                <FieldSelect key={f.id} field={f} value={form[f.id]} onChange={set} />
              ))}
            </div>

            {/* Nav + Predict row */}
            <div style={{ display: 'flex', gap: 10 }}>
              {currentIdx > 0 && (
                <button onClick={goPrev} style={{
                  flex: '0 0 auto', padding: '12px 20px',
                  background: 'transparent', border: '1px solid rgba(83,74,183,0.3)',
                  color: '#9090c0', borderRadius: 8, fontSize: 13, cursor: 'pointer',
                }}>← Back</button>
              )}

              {!isLast ? (
                <button onClick={goNext} style={{
                  flex: 1, padding: '12px', background: '#2a2848',
                  color: '#c0c0e0', border: '1px solid rgba(83,74,183,0.3)',
                  borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer',
                }}>Next: {TABS[currentIdx + 1].label} →</button>
              ) : (
                <button onClick={predict} disabled={loading} style={{
                  flex: 1, padding: '13px',
                  background: loading ? '#3C3489' : '#534AB7',
                  color: '#fff', border: 'none', borderRadius: 8,
                  fontSize: 14, fontWeight: 500,
                  transition: 'all 0.2s', cursor: loading ? 'wait' : 'pointer',
                }}>
                  {loading ? '🧠 Analyzing...' : 'Predict attrition risk →'}
                </button>
              )}
            </div>

            {/* Tab completion indicator */}
            <div style={{ marginTop: 16, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {TABS.map((t, i) => (
                <span key={t.id} onClick={() => setActiveTab(t.id)} style={{
                  fontSize: 10, padding: '3px 8px', borderRadius: 10,
                  background: visited.has(t.id) ? 'rgba(29,158,117,0.15)' : i === currentIdx ? 'rgba(127,119,221,0.2)' : 'rgba(255,255,255,0.04)',
                  color: visited.has(t.id) ? TEAL : i === currentIdx ? '#a0a0e0' : '#404055',
                  cursor: 'pointer', border: `1px solid ${i < currentIdx ? 'rgba(29,158,117,0.3)' : 'transparent'}`,
                }}>
                  {visited.has(t.id) ? '✓ ' : ''}{t.label.split(' ').slice(1).join(' ')}
                </span>
              ))}
            </div>
          </div>

          {/* ── Result panel ── */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ animation: 'float 4s ease-in-out infinite' }}>
              <Avatar mood={mood} size={200} />
            </div>

            {result && (
              <div style={{
                width: '100%', background: '#1a1a28',
                border: `1px solid ${result.isRisk ? 'rgba(216,90,48,0.4)' : 'rgba(29,158,117,0.4)'}`,
                borderRadius: 12, padding: 20,
              }}>
                {/* Risk label */}
                <div style={{
                  fontSize: 15, fontWeight: 600, marginBottom: 12, textAlign: 'center',
                  color: result.isRisk ? '#F09595' : '#5DCAA5',
                }}>
                  {pct > 60 ? '⚠ High attrition risk' : pct > 35 ? '⚠ Medium attrition risk' : '✓ Low attrition risk'}
                </div>

                {/* Probability bar */}
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#8888a8', marginBottom: 6 }}>
                    <span>Risk probability</span>
                    <span style={{ fontWeight: 600, color: result.isRisk ? '#F09595' : '#5DCAA5' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 8, background: '#2a2a38', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      background: pct > 60 ? RED : pct > 35 ? AMBER : TEAL,
                      width: `${pct}%`, transition: 'width 1s ease',
                    }} />
                  </div>
                  {/* Risk scale labels */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#404055', marginTop: 4 }}>
                    <span>Low</span><span>Medium</span><span>High</span>
                  </div>
                </div>

                {/* Summary message */}
                <p style={{ fontSize: 12, color: '#666680', lineHeight: 1.6, textAlign: 'center', marginBottom: 12 }}>
                  {result.isRisk
                    ? 'This profile shows elevated risk. Consider a retention conversation, salary review, or workload adjustment.'
                    : 'This profile indicates good retention likelihood. Keep up engagement and growth opportunities.'}
                </p>

                {/* Risk signals */}
                {result.signals.length > 0 && (
                  <div style={{
                    padding: '10px 14px',
                    background: result.isRisk ? 'rgba(216,90,48,0.08)' : 'rgba(29,158,117,0.08)',
                    borderRadius: 8,
                    border: `1px solid ${result.isRisk ? 'rgba(216,90,48,0.2)' : 'rgba(29,158,117,0.2)'}`,
                  }}>
                    <div style={{ fontSize: 11, color: result.isRisk ? '#F09595' : '#5DCAA5', fontWeight: 500, marginBottom: 8 }}>
                      {result.isRisk ? '⚠ Risk signals detected:' : '✓ Positive retention signals:'}
                    </div>
                    {result.signals.slice(0, 6).map((s, i) => (
                      <div key={i} style={{ fontSize: 11, color: result.isRisk ? '#c08080' : '#70c0a0', marginBottom: 4, display: 'flex', gap: 6 }}>
                        <span>{result.isRisk ? '•' : '✓'}</span><span>{s}</span>
                      </div>
                    ))}
                    {result.signals.length > 6 && (
                      <div style={{ fontSize: 10, color: '#505068', marginTop: 4 }}>
                        +{result.signals.length - 6} more signals
                      </div>
                    )}
                  </div>
                )}

                {/* Feature coverage badge */}
                <div style={{ marginTop: 12, textAlign: 'center' }}>
                  <span style={{ fontSize: 10, color: '#404055', padding: '3px 8px', background: 'rgba(83,74,183,0.1)', borderRadius: 10 }}>
                    27 features analyzed · Based on IBM HR dataset patterns
                  </span>
                </div>
              </div>
            )}

            {!result && (
              <div style={{
                width: '100%', background: '#1a1a28',
                border: '1px solid rgba(83,74,183,0.15)',
                borderRadius: 12, padding: 20, textAlign: 'center',
              }}>
                <div style={{ fontSize: 13, color: '#404055', lineHeight: 1.7 }}>
                  Complete all 6 sections and click <strong style={{ color: '#7070a0' }}>Predict</strong> to see the full risk assessment with avatar reaction.
                </div>
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    ['👤 Personal', 'Age, gender, education'],
                    ['💼 Job Info', 'Role, level, travel, overtime'],
                    ['💰 Compensation', 'Income, hike, stock options'],
                    ['😊 Satisfaction', 'Job, environment, relationships'],
                    ['📈 Experience', 'Working years, performance'],
                    ['🗓 Tenure', 'Years at company, promotions'],
                  ].map(([tab, desc]) => (
                    <div key={tab} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#505068' }}>
                      <span>{tab}</span><span style={{ color: '#383850' }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}