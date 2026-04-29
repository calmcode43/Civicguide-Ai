# CivicMind

CivicMind is a production-grade, AI-powered Indian Election Process Assistant featuring a visually stunning 3D frontend.

## Repository Structure

- `frontend/`: Next.js 14 + TypeScript + Tailwind + Three.js
- `backend/`: FastAPI + Python 3.11

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **UI Components**: Radix UI, Lucide React
- **State/Data**: Firebase

### Backend
- **Framework**: FastAPI
- **AI**: Google Gemini API
- **Database**: Firestore (via google-cloud-firestore)
- **Deployment**: Google Cloud Run (Docker)

## Getting Started

### Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. Copy `.env.example` to `.env` and fill in your keys.
4. `uvicorn app.main:app --reload`

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`
