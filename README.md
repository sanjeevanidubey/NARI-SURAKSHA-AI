# Nari Suraksha AI 🛡️
An AI-powered predictive women's safety platform that generates dynamic safety scores for streets and routes using multiple real-time indicators. Rather than reacting to emergencies (like standard SOS apps), it predicts safety levels and proactively guides users onto optimized paths.

## 👥 Developers
* **Sanjeevani Dubey**
* **Deepali Singh**

---

## 📁 Repository Structure & Organization
This project is modularly structured into three distinct folders:

```
safeher-ai/
├── AI/                           # Machine Learning & AI Modeling
│   ├── train.py                  # Synthetic data generator & Decision Tree compiler (exports JSON model)
│   ├── predict.py                # Standalone inference evaluator & test scripts
│   └── safety_tree.json          # Compiled JSON representation of the trained AI Decision Tree
│
├── backend/                      # REST API Server (Python FastAPI)
│   ├── app/
│   │   ├── ml/
│   │   │   ├── inference.py      # ML Model Loader & Explainability Parser
│   │   │   └── safety_tree.json  # Simlinked/copied decision tree for server inference
│   │   ├── models/
│   │   │   └── schemas.py        # Pydantic Schemas for requests and responses
│   │   ├── services/
│   │   │   └── osm_service.py    # Route calculations, Haversine geometry, and mock emergency data
│   │   └── main.py               # API Endpoints (CORS enabled, routing, safety reporting)
│   ├── requirements.txt          # Python dependencies
│   └── run.py                    # Uvicorn entry point script
│
└── frontend/                     # Interactive Web Application (React + Vite + Tailwind CSS)
    ├── dist/                     # Optimized production bundle ready for Vercel/Netlify
    ├── src/
    │   ├── utils/
    │   │   └── localRiskEngine.js # Client-side fallback Risk Engine (evaluates ML tree in JS)
    │   ├── App.jsx               # Main React Dashboard, Splash Screen, and Login Screens
    │   ├── index.css             # Main stylesheet containing 20+ keyframe animations & premium theme variables
    │   └── main.jsx              # React mounting entry point
    ├── index.html                # Main HTML template containing Leaflet and FontAwesome scripts
    ├── tailwind.config.js        # Tailwind custom animations & theme parameters
    ├── postcss.config.js         # PostCSS compiler configuration
    ├── vite.config.js            # Vite configurations
    └── package.json              # Node dependencies & package configuration
```

---

## 🚀 Easy Deployments

### 1. Frontend Deployment (Vercel)
The frontend is built as a Single Page Application (SPA) using React + Vite. It features a **local risk engine fallback** that runs the trained Machine Learning decision tree model directly in the browser. This means **the frontend can be deployed completely standalone on Vercel and it will function perfectly!**

#### Steps to Deploy Frontend to Vercel:
1. Initialize a Git repository in the `safeher-ai/frontend` directory or push the whole monorepo to GitHub.
2. Go to your [Vercel Dashboard](https://vercel.com) and click **Add New Project**.
3. Select your GitHub repository.
4. **Configure Project Settings**:
   * **Root Directory**: Select `frontend` (crucial if deploying from a monorepo).
   * **Framework Preset**: Select `Vite`.
   * **Build Command**: `npm run build` or `vite build`
   * **Output Directory**: `dist`
   * **Install Command**: `npm install`
5. Click **Deploy**. Vercel will build and host your web app in seconds!

### 2. Backend Deployment (Render / Railway)
The Python FastAPI backend can be hosted on any cloud provider supporting Python (e.g., Render, Railway, or Heroku).

#### Steps to Deploy Backend to Render:
1. Create a new Web Service on [Render](https://render.com).
2. Connect your GitHub repository.
3. Configure settings:
   * **Root Directory**: `backend`
   * **Runtime**: `Python`
   * **Build Command**: `pip install -r requirements.txt`
   * **Start Command**: `python run.py`
4. Set up an environment variable in the Vercel Frontend if you wish to route API calls directly to this live backend URL (the React frontend is already pre-configured to gracefully fallback to local client-side evaluation if no backend URL is provided or reachable).

---

## 💻 Local Development Setup

### Prerequisites
* [Node.js](https://nodejs.org) (v16+)
* [Python 3.8+](https://python.org)

### Setup & Run Frontend
1. Open a terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the local development server:
   ```bash
   npm run dev
   ```
4. Open the displayed URL in your browser (usually `http://localhost:5173`).

### Setup & Run Backend (Optional)
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the API server:
   ```bash
   python run.py
   ```
4. The server will start on `http://localhost:8000`.

---

## 🛡️ Key Features of Nari Suraksha AI
* **Dynamic AI Safety Risk Engine**: Employs a trained decision tree that evaluates street risks dynamically based on Time of Day, Street Lighting, Crowd Density, Weather, and Historical crime baseline indexes.
* **Splash Landing Screen**: Modern splash page with soft animations, logo, cartoon emojis, and central interactive option keys.
* **Metropolitan Security Hubs**: warp routing mapping for top Indian metropolises (New Delhi, Mumbai, Bengaluru, Kolkata, Varanasi, Chennai, Hyderabad) with real-time baseline datasets.
* **Dual Routing Systems**: Displays both the **Safest Route** (AI recommended, glowing pink) and the **Fastest Route** (danger risk shortcut, dark red) side-by-side.
* **Interactive Leaflet Mapping**: Shows exact locations of nearby police stations (with phone helplines), hospitals (with ambulance numbers), and safe zones.
* **On-Demand Voice Assistant**: Speaks safety instructions and warnings only when clicked to prevent unsolicited sounds.
* **Emergency Distress SOS**: Generates direct dialing links for police and ambulance services, and broadcasts coordinates in real-time.
* **Light and Dark Modes**: Soft, responsive baby-pink and magenta themed layout with smooth glassmorphic designs.
