# SurveyApp

A full-stack survey application built with React and FastAPI that allows users to create, share, and analyze surveys with a Google Forms-style dashboard.

## Features

- **Create Surveys**: Build surveys with multiple question types (text, multiple choice, checkbox, rating, dropdown)
- **Share Surveys**: Generate unique shareable links for easy distribution
- **Collect Responses**: Clean, mobile-friendly response forms with validation
- **Analyze Results**: Dashboard with charts, statistics, and CSV export
- **Documentation**: Built-in help section for users

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19 + Vite + TailwindCSS |
| Backend | Python FastAPI |
| Database | MongoDB |
| Charts | Recharts |
| Icons | Lucide React |
| Containerization | Docker Compose |

---

## Quick Start with Docker

The fastest way to get started is using Docker Compose:

```bash
# Clone the repository
git clone <your-repo-url>
cd windsurf-project

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

To stop the services:
```bash
docker-compose down
```

To stop and remove all data:
```bash
docker-compose down -v
```

---

## Local Development Setup (Mac)

### Prerequisites

#### 1. Install Homebrew

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### 2. Install Docker Desktop

Download and install from: https://www.docker.com/products/docker-desktop/

Or via Homebrew:
```bash
brew install --cask docker
```

#### 3. Install nvm (Node Version Manager)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Restart your terminal, then:
```bash
# Install Node.js (uses .nvmrc in frontend directory)
cd frontend
nvm install
nvm use
```

#### 4. Install Python 3.11+

```bash
brew install python@3.11
```

Or use pyenv:
```bash
brew install pyenv
pyenv install 3.11.7
pyenv global 3.11.7
```

---

### Option A: Run with Docker (Recommended)

```bash
docker-compose up --build
```

### Option B: Run Services Locally

#### 1. Start MongoDB

Using Docker (easiest):
```bash
docker run -d --name mongodb -p 27017:27017 -v mongodb_data:/data/db mongo:7.0
```

Or install via Homebrew:
```bash
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### 2. Start the Backend

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn app.main:app --reload --port 8000
```

#### 3. Start the Frontend

```bash
cd frontend

# Use correct Node version
nvm use

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## Accessing the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Documentation | http://localhost:8000/docs |
| Alternative API Docs | http://localhost:8000/redoc |

---

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URL` | `mongodb://localhost:27017` | MongoDB connection string |
| `DATABASE_NAME` | `survey_app` | Database name |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8000` | Backend API URL |

---

## Project Structure

```
windsurf-project/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   ├── services/         # API client
│   │   └── App.jsx           # Main app with routing
│   ├── Dockerfile
│   ├── package.json
│   └── .nvmrc
├── backend/                  # FastAPI application
│   ├── app/
│   │   ├── main.py           # App entry point
│   │   ├── database.py       # MongoDB connection
│   │   ├── schemas.py        # Pydantic models
│   │   └── routers/          # API endpoints
│   ├── Dockerfile
│   ├── requirements.txt
│   └── README.md             # Backend-specific docs
├── docs/
│   └── PLAN.md               # Project plan
├── docker-compose.yml        # Docker orchestration
└── README.md                 # This file
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/surveys` | Create a new survey |
| `GET` | `/api/surveys` | List all surveys |
| `GET` | `/api/surveys/{id}` | Get survey by ID |
| `PUT` | `/api/surveys/{id}` | Update survey |
| `DELETE` | `/api/surveys/{id}` | Delete survey |
| `GET` | `/api/surveys/share/{share_id}` | Get survey by share link |
| `POST` | `/api/surveys/{id}/responses` | Submit response |
| `GET` | `/api/surveys/{id}/responses` | Get all responses |
| `GET` | `/api/surveys/{id}/analytics` | Get analytics |

---

## Troubleshooting

### MongoDB Connection Issues

```bash
# Check if MongoDB is running
docker ps | grep mongo

# Or if using Homebrew
brew services list | grep mongodb
```

### Port Already in Use

```bash
# Find process using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Node Version Issues

```bash
cd frontend
nvm install
nvm use
```

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose up --build

# Clean up everything
docker-compose down -v --rmi all
docker-compose up --build
```

---

## License

MIT
