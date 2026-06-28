import React, { useEffect, useState } from 'react';

const NAV_LINKS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'predictor', label: 'Predictor' },
  { id: 'insights', label: 'Insights' },
];

export default function Navbar({ scrollTo }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(15,15,19,0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(83,74,183,0.3)' : 'none',
      transition: 'all 0.3s ease',
      padding: '0 32px', height: '60px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg,#534AB7,#7F77DD)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16
        }}>🧠</div>
        <span style={{ fontWeight: 600, fontSize: 16, color: '#e8e8f0' }}>AttritionIQ</span>
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 10,
          background: 'rgba(83,74,183,0.25)', color: '#9D97E8',
          border: '1px solid rgba(83,74,183,0.4)', marginLeft: 4
        }}>College Project</span>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {NAV_LINKS.map(l => (
          <button key={l.id} onClick={() => scrollTo(l.id)} style={{
            background: 'none', border: 'none', color: '#a0a0b8',
            fontSize: 13, padding: '6px 14px', borderRadius: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.color = '#e8e8f0'; e.target.style.background = 'rgba(255,255,255,0.06)'; }}
          onMouseLeave={e => { e.target.style.color = '#a0a0b8'; e.target.style.background = 'none'; }}
          >{l.label}</button>
        ))}
      </div>
    </nav>
  );
}
