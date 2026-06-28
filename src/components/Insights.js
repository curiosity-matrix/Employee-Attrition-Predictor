import React from 'react';

const CARDS = [
  { icon: '🧠', title: 'Deep neural network', desc: '4-layer ANN architecture: 128 → 64 → 32 → 1 (sigmoid). Dropout layers of 0.3, 0.3, 0.2 between each hidden layer to prevent overfitting.' },
  { icon: '⚖️', title: 'SMOTE balancing', desc: 'Synthetic Minority Oversampling Technique handles the 84/16 class imbalance by generating synthetic "attrition" samples in the training set.' },
  { icon: '⏱', title: 'Early stopping', desc: 'Monitors validation loss with patience=10 and restores best weights automatically — prevents the model from memorizing training noise.' },
  { icon: '🔧', title: 'Feature engineering', desc: 'One-hot encoding for 6 categorical features, StandardScaler for numerical features. 35 raw features expand to 50+ after encoding.' },
  { icon: '📊', title: 'Class 0 performance', desc: '89% precision, 91% recall, 90% F1-score for non-attrition class. The model is very reliable at identifying employees who will stay.' },
  { icon: '⚠️', title: 'Known limitation', desc: 'Class 1 (attrition) recall is only 40% — 6 out of 10 actual leavers are missed. Lowering the decision threshold from 0.5 to 0.3 can improve this.' },
  { icon: '🎯', title: 'Adam optimizer', desc: 'Adaptive learning rate optimizer with binary cross-entropy loss — ideal for binary classification tasks with imbalanced data.' },
  { icon: '📈', title: 'Accuracy vs AUC', desc: 'Overall accuracy is 83% but misleading. The real metric to watch is Recall for Class 1. Adding AUC-ROC would give a threshold-independent view.' },
  { icon: '🔮', title: 'Future improvements', desc: 'Compare ANN vs Random Forest vs XGBoost, add SHAP for feature importance, tune the threshold, and use cross-validation for more robust evaluation.' },
];

export default function Insights() {
  return (
    <div style={{ padding: '80px 48px', background: '#0d0d12', minHeight: '80vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 12, color: '#7F77DD', fontWeight: 500, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>Model insights</div>
          <h2 style={{ fontSize: 36, fontWeight: 600, color: '#f0f0f8' }}>How the model works</h2>
          <p style={{ fontSize: 14, color: '#6868888', marginTop: 8 }}>Architecture decisions, techniques, and limitations explained.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {CARDS.map((c, i) => (
            <div key={i} style={{
              background: '#1a1a28', border: '1px solid rgba(83,74,183,0.2)',
              borderRadius: 12, padding: 22,
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(83,74,183,0.5)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(83,74,183,0.2)'; e.currentTarget.style.transform = 'none'; }}
            >
              <div style={{ fontSize: 26, marginBottom: 12 }}>{c.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: '#e0e0f0', marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: '#7878988', lineHeight: 1.65 }}>{c.desc}</div>
            </div>
          ))}
        </div>

        {/* Pipeline diagram */}
        <div style={{ marginTop: 40, background: '#1a1a28', border: '1px solid rgba(83,74,183,0.2)', borderRadius: 16, padding: 28 }}>
          <div style={{ fontSize: 13, color: '#8888a8', marginBottom: 20, fontWeight: 500 }}>ML pipeline</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
            {[
              { step: '01', label: 'Load CSV', sub: '1,470 rows' },
              { step: '02', label: 'Encode', sub: 'OHE + Scale' },
              { step: '03', label: 'Split', sub: '80 / 20' },
              { step: '04', label: 'SMOTE', sub: 'Balance train' },
              { step: '05', label: 'Train ANN', sub: '100 epochs' },
              { step: '06', label: 'Evaluate', sub: 'F1, Recall' },
              { step: '07', label: 'Predict', sub: 'New employee' },
            ].map((s, i, arr) => (
              <React.Fragment key={i}>
                <div style={{ textAlign: 'center', minWidth: 100 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', margin: '0 auto 8px',
                    background: i === arr.length - 1 ? '#534AB7' : 'rgba(83,74,183,0.2)',
                    border: '1px solid rgba(83,74,183,0.4)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600, color: i === arr.length - 1 ? '#fff' : '#9D97E8',
                  }}>{s.step}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: '#c0c0d8', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: '#606078' }}>{s.sub}</div>
                </div>
                {i < arr.length - 1 && (
                  <div style={{ flex: 1, height: 1, background: 'rgba(83,74,183,0.3)', minWidth: 20, marginBottom: 28 }} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
