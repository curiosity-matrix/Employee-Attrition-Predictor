import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      padding: '24px 48px', borderTop: '1px solid rgba(83,74,183,0.2)',
      background: '#0a0a10', textAlign: 'center',
      fontSize: 12, color: '#5050688', lineHeight: 2,
    }}>
      <div style={{ marginBottom: 4 }}>
        <span style={{ color: '#7F77DD', fontWeight: 500 }}>AttritionIQ</span> — HR Employee Attrition Prediction
      </div>
      <div>Built with TensorFlow · Keras · SMOTE · React · Recharts &nbsp;|&nbsp; College Project</div>
    </footer>
  );
}
