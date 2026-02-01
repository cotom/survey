# Survey Application - Implementation Plan

Build a full-stack survey application with React (Vite) frontend and FastAPI backend with MongoDB, featuring survey creation, sharing, response collection, and a Google Forms-style results dashboard.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 + JavaScript + Vite |
| **Styling** | TailwindCSS + custom UI components |
| **Charts** | Recharts (for dashboard visualizations) |
| **Routing** | React Router v7 |
| **Backend** | Python FastAPI |
| **Database** | MongoDB (with Motor async driver) |
| **Containerization** | Docker Compose with persistent volumes |
| **Node Version** | Managed via nvm (.nvmrc file) |
| **Authentication** | None (learning app - can be added later) |

---

## Project Structure

```
windsurf-project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # Reusable UI components
│   │   │   ├── survey/          # Survey-related components
│   │   │   └── Layout.jsx       # Main layout
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── CreateSurvey.jsx
│   │   │   ├── AnswerSurvey.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Documentation.jsx
│   │   ├── hooks/
│   │   ├── services/            # API client
│   │   └── App.jsx
│   ├── package.json
│   ├── vite.config.js
│   ├── .nvmrc
│   ├── Dockerfile
│   └── README.md
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── schemas.py
│   │   ├── database.py
│   │   └── routers/
│   │       ├── surveys.py
│   │       └── responses.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md                # MongoDB setup & index instructions
├── docs/
│   └── PLAN.md                  # This file
├── docker-compose.yml           # All services + volumes
└── README.md                    # Main setup instructions for Mac
```

---

## MongoDB Collections & Indexes

### Collections
- **surveys** — Stores survey definitions with embedded questions
- **responses** — Stores survey responses with answers

### Indexes (documented in backend README)
```javascript
// surveys collection
db.surveys.createIndex({ "created_at": -1 })
db.surveys.createIndex({ "share_id": 1 }, { unique: true })

// responses collection
db.responses.createIndex({ "survey_id": 1 })
db.responses.createIndex({ "survey_id": 1, "submitted_at": -1 })
```

---

## Core Features

### 1. Survey Creation
- **Question types**: Text, Multiple Choice, Checkbox, Rating Scale, Dropdown
- Required/optional question toggle
- Survey title and description

### 2. Survey Sharing
- Generate unique shareable link (UUID-based `share_id`)
- Copy link to clipboard functionality
- Public access (no authentication)

### 3. Survey Response
- Clean, mobile-friendly form interface
- Form validation
- Success confirmation after submission

### 4. Results Dashboard
- **Summary view**: Total responses
- **Per-question analytics**:
  - Pie charts for multiple choice/checkbox
  - Bar charts for ratings
  - Response list for text answers
- Export responses (CSV)

### 5. Documentation Section
- **Getting Started**: Overview of the application
- **Creating Surveys**: Step-by-step guide
- **Question Types**: Explanation of each question type
- **Sharing Surveys**: How to share and distribute surveys
- **Viewing Results**: How to interpret the dashboard
- **FAQ**: Common questions and troubleshooting

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/surveys` | Create a new survey |
| `GET` | `/api/surveys` | List all surveys |
| `GET` | `/api/surveys/{id}` | Get survey by ID |
| `PUT` | `/api/surveys/{id}` | Update survey |
| `DELETE` | `/api/surveys/{id}` | Delete survey |
| `GET` | `/api/surveys/share/{share_id}` | Get survey by share link (public) |
| `POST` | `/api/surveys/{id}/responses` | Submit response |
| `GET` | `/api/surveys/{id}/responses` | Get all responses |
| `GET` | `/api/surveys/{id}/analytics` | Get aggregated analytics |

---

## Docker Compose Services

```yaml
services:
  frontend:    # Vite dev server on port 5173
  backend:     # FastAPI on port 8000
  mongodb:     # MongoDB on port 27017

volumes:
  mongodb_data:  # Persistent data volume
```

---

## Implementation Status

### Phase 1: Project Setup ✅
1. Create frontend with Vite + React
2. Configure TailwindCSS
3. Set up FastAPI backend with Motor (async MongoDB driver)
4. Create Docker Compose with MongoDB and persistent volumes

### Phase 2: Backend Implementation ✅
5. Define MongoDB document models (Survey, Response)
6. Create Pydantic schemas for validation
7. Implement survey CRUD endpoints
8. Implement response submission and retrieval
9. Add analytics aggregation endpoint

### Phase 3: Frontend Implementation ✅
10. Set up React Router with pages
11. Build survey creation form with dynamic question builder
12. Create survey answer page with form validation
13. Build dashboard with Recharts visualizations
14. Implement API service layer
15. Create Documentation page with usage guides

### Phase 4: Documentation ✅
16. Create docs/ directory with project plan
17. Write main README with Mac setup instructions
18. Write backend README with MongoDB setup
19. Write frontend README with development instructions

---

## Future Enhancements

- User authentication
- Survey editing after creation
- Survey templates
- Email notifications
- Response time tracking
- Advanced analytics
- Survey embedding
