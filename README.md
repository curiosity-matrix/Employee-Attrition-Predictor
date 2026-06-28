# AttritionIQ — HR Employee Attrition Prediction

> Imagine you're an HR manager at a big MNC.  
> Every Monday morning, you sit across from employees — and somewhere in that room, a few people have already decided to quit. They just haven't told you yet.  
>  
> What if you had a superpower — to look at an employee's profile and know, before they even type their resignation, whether they're about to leave?  
>  
> That's exactly what **AttritionIQ** does.

🔗 **Live Demo:** [employee-attrition-predictor.netlify.app](https://employee-attrition-predictor.netlify.app)

---

## What This Is

**AttritionIQ** is a full-stack HR analytics application that predicts employee attrition using a deep neural network trained on IBM HR Analytics data. You fill in an employee's profile, and the model tells you — with a probability score — whether that person is likely to leave.

Not a Colab notebook. Not a static plot. A working app.

---

## The Stack

| Layer | Tech |
|---|---|
| ML Model | TensorFlow / Keras (ANN) |
| Data Balancing | SMOTE (imblearn) |
| Backend | Flask (Python) |
| Frontend | React.js + Recharts |
| Preprocessing | Scikit-learn (StandardScaler, LabelEncoder) |
| Dataset | IBM HR Analytics — 1,470 employees, 35 features |

---

## How It Was Built

### The ML Part (my work)
The core of this project is a **4-layer Artificial Neural Network** trained in Google Colab:

- **EDA** — Explored 35 features, identified class imbalance (84% stayed, 16% left)
- **Preprocessing** — One-hot encoding for 6 categorical features, StandardScaler for numerical ones. 35 raw features expanded to 50+ after encoding.
- **SMOTE** — Applied Synthetic Minority Oversampling to balance the training set before model training
- **ANN Architecture** — `128 → 64 → 32 → 1 (sigmoid)` with Dropout layers (0.3, 0.3, 0.2) to prevent overfitting
- **Training** — Adam optimizer, binary cross-entropy loss, EarlyStopping with patience=10
- **Saved artifacts** — `attrition_model.h5`, `scaler.pkl`, `label_encoder.pkl`, `model_columns.pkl`

The trained model files were then plugged into the Flask backend to serve real-time predictions.

### The App Part (AI-assisted)
The **React frontend and Flask API integration** were built with the help of Claude (AI). The UI decisions, component structure, and overall product design were guided by me — what pages to show, what information matters, how the prediction flow should feel. The AI helped translate that into working code.

This is the same way a developer uses GitHub Copilot or a designer uses Figma AI — the thinking was mine, the execution had help.

---

## ML Pipeline

```
Load CSV (1,470 rows)
    → Encode (OHE + Scale)
        → Split (80/20)
            → SMOTE (balance train set)
                → Train ANN (100 epochs)
                    → Evaluate (F1, Recall)
                        → Predict (new employee)
```

---

## Model Performance

| Metric | Class 0 (Stays) | Class 1 (Leaves) |
|---|---|---|
| Precision | 89% | — |
| Recall | 91% | 40% |
| F1-Score | 90% | — |
| Overall Accuracy | **83%** | |

**Known limitation:** Class 1 recall is only 40% — the model misses some actual leavers. Lowering the decision threshold from 0.5 to 0.3 can improve this. AUC-ROC would give a better evaluation picture than accuracy alone.

---

## Key Findings from the Data

- **Overtime is the strongest predictor** — employees who work overtime are 3x more likely to leave
- **18–25 age group** has the highest attrition rate at 37%
- **Sales department** has the highest attrition rate across departments
- **Frequent business travel** correlates with significantly higher attrition

---

## Project Structure

```
AttritionIQ/
├── backend/
│   ├── app.py                  # Flask API
│   ├── attrition_model.h5      # Trained ANN
│   ├── scaler.pkl              # Fitted StandardScaler
│   ├── label_encoder.pkl       # Fitted LabelEncoder
│   └── model_columns.pkl       # Feature column names
├── src/
│   └── components/
│       ├── Dashboard.js        # Analytics dashboard
│       ├── Predictor.js        # Employee prediction form
│       ├── Insights.js         # Model explainability page
│       ├── Hero.js             # Landing page
│       ├── Navbar.js
│       └── Footer.js
├── notebooks/
│   └── attrition_training.ipynb  # Original Colab training code
├── public/
├── package.json
└── README.md
```

---

## How to Run

### Backend (Flask)
```bash
cd backend
pip install flask flask-cors tensorflow scikit-learn imbalanced-learn
python app.py
# Runs on http://localhost:5000
```

### Frontend (React)
```bash
npm install
npm start
# Runs on http://localhost:3000
```

---

## What I Learned

- How to handle **class imbalance** in real datasets using SMOTE
- Why **accuracy is misleading** for imbalanced problems — Recall and F1 matter more
- How to **serialize and deploy** a trained model using `.pkl` and `.h5` files
- How ML and web development connect — from Colab notebook to a live prediction app

---

## Future Improvements

- Add SHAP values for feature importance visualization
- Tune decision threshold from 0.5 → 0.3 for better attrition recall
- Compare ANN vs Random Forest vs XGBoost
- Add cross-validation for more robust evaluation
- Deploy on Render / Railway

---

*Built as a college project by **Ritika** — B.Tech AIML, SRMCEM Lucknow*  
*Dataset: [IBM HR Analytics Employee Attrition & Performance](https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset)*
