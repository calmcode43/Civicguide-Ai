# CivicMind | AI Indian Election Process Assistant

CivicMind is an AI-powered platform designed to guide Indian citizens through the complexities of the election process. It provides an interactive 3D timeline of the democratic journey, an AI-powered election assistant, and tools to decode ballots and plan voting.

## 🚀 Key Features

- **Interactive 3D Timeline**: A visual, step-by-step map of the entire election cycle from announcement to government formation.
- **AI Election Assistant**: Real-time answers to queries about voting rules, candidate information, and constitutional procedures powered by Google Gemini.
- **Ballot Decoder**: Simplify complex ballot information for better voter understanding.
- **Voting Plan**: Personalized guides to help citizens ensure their vote is cast correctly.

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion & GSAP
- **3D Rendering**: React Three Fiber & Three.js
- **State Management**: Zustand

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **AI Integration**: Google Gemini API
- **Rate Limiting**: SlowAPI
- **Documentation**: Swagger/OpenAPI

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Google Gemini API Key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/calmcode43/Civicguide-Ai.git
   cd Civicguide-Ai
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GOOGLE_CLOUD_PROJECT=your_project_id
   ALLOWED_ORIGINS=http://localhost:5173
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

### Running Locally

1. **Start the Backend**:
   ```bash
   cd backend
   uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
   ```

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 🛡️ Recent Updates

- **Vite Migration**: Migrated from Next.js to Vite for faster development and optimized build performance.
- **Firebase Removal**: Transitioned from Firebase Hosting/Auth to a localized backend architecture to support more robust AI integrations.
- **Timeline Fixes**: Realigned the 3D timeline with the backend API for a more premium and responsive user experience.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
