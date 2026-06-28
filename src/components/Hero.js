import React from 'react';
import Avatar from './Avatar';

export default function Hero({ scrollTo }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      padding: '80px 48px 48px',
      background: 'radial-gradient(ellipse at 70% 50%, rgba(83,74,183,0.15) 0%, transparent 60%), #0f0f13',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.04,
        backgroundImage: 'linear-gradient(rgba(83,74,183,1) 1px, transparent 1px), linear-gradient(90deg, rgba(83,74,183,1) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 380px', gap: 48, alignItems: 'center', position: 'relative' }}>
        <div style={{ animation: 'fadeInUp 0.7s ease forwards' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(83,74,183,0.15)', border: '1px solid rgba(83,74,183,0.35)',
            borderRadius: 20, padding: '5px 14px', fontSize: 12, color: '#9D97E8', marginBottom: 24
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7F77DD', display: 'inline-block' }} />
            Deep Learning · ANN · SMOTE · TensorFlow
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 600, lineHeight: 1.15, marginBottom: 20, color: '#f0f0f8' }}>
            Predict who will<br />
            <span style={{ color: '#7F77DD' }}>leave next</span> — before<br />
            they decide to.
          </h1>

          <p style={{ fontSize: 16, color: '#8888a0', lineHeight: 1.75, marginBottom: 32, maxWidth: 480 }}>
            An AI-powered HR analytics tool using a 4-layer deep neural network trained on IBM HR data to identify at-risk employees with 83% accuracy.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => scrollTo('predictor')} style={{
              background: '#534AB7', color: '#fff', border: 'none',
              padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.target.style.background = '#3C3489'}
            onMouseLeave={e => e.target.style.background = '#534AB7'}
            >Try the predictor →</button>

            <button onClick={() => scrollTo('dashboard')} style={{
              background: 'transparent', color: '#9D97E8',
              border: '1px solid rgba(83,74,183,0.4)',
              padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.background = 'rgba(83,74,183,0.1)'; }}
            onMouseLeave={e => { e.target.style.background = 'transparent'; }}
            >View dashboard</button>
          </div>

          <div style={{ display: 'flex', gap: 32, marginTop: 48 }}>
            {[
              { val: '1,470', lbl: 'Employees' },
              { val: '16.1%', lbl: 'Attrition rate' },
              { val: '83%', lbl: 'Model accuracy' },
              { val: '35+', lbl: 'Features used' },
            ].map(s => (
              <div key={s.lbl}>
                <div style={{ fontSize: 22, fontWeight: 600, color: '#e8e8f0' }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#6060788' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', animation: 'float 4s ease-in-out infinite' }}>
          <Avatar mood="neutral" size={320} />
        </div>
      </div>
    </div>
  );
}
