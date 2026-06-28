# AttritionIQ — HR Attrition Prediction Frontend

A React-based dashboard for the HR Employee Attrition Deep Learning project.

---

## File Structure

```
attritioniq/
├── public/
│   └── index.html              ← HTML entry point
├── src/
│   ├── components/
│   │   ├── Navbar.js           ← Top navigation bar
│   │   ├── Hero.js             ← Landing hero section
│   │   ├── Avatar.js           ← 3D-style SVG avatar (reacts to prediction)
│   │   ├── Dashboard.js        ← Charts and dataset analytics
│   │   ├── Predictor.js        ← Employee form + live prediction
│   │   ├── Insights.js         ← Model explanation + pipeline diagram
│   │   └── Footer.js           ← Footer
│   ├── App.js                  ← Root component, section routing
│   ├── index.js                ← React entry point
│   └── index.css               ← Global styles + animations
├── package.json                ← Dependencies
└── README.md
```

---

## Requirements

- **Node.js** v16 or above — https://nodejs.org/
- **npm** (comes with Node)

Check if installed:
```bash
node -v
npm -v
```

---

## How to Run

### Step 1 — Open terminal in the project folder
```bash
cd attritioniq
```

### Step 2 — Install dependencies (only first time)
```bash
npm install
```
This installs React, Recharts, and all other packages. Takes 1–2 minutes.

### Step 3 — Start the development server
```bash
npm start
```

### Step 4 — Open in browser
The app opens automatically at:
```
http://localhost:3000
```

---

## Build for submission / deployment

To create a production build (faster, optimized):
```bash
npm run build
```
This creates a `build/` folder. You can open `build/index.html` directly or host it on GitHub Pages, Netlify, or Vercel for free.

---

## Sections

| Section    | What it shows |
|------------|---------------|
| Hero       | Project intro, animated floating avatar, key stats |
| Dashboard  | Bar charts, pie chart, model metrics, training loss curve |
| Predictor  | Employee form → AI risk score → avatar reacts (green/red) |
| Insights   | Model architecture, SMOTE, limitations, ML pipeline diagram |

---

## Notes

- The predictor uses a rule-based scoring function that mirrors the patterns learned by the ANN (overtime, age, income, satisfaction, etc.)
- To connect it to your actual trained model, expose it as a Flask/FastAPI endpoint and call it from `Predictor.js`
- Charts are powered by Recharts — no extra setup needed
