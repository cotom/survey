# SurveyApp Frontend

React-based single-page application for the Survey App.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Styling
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Lucide React** - Icons

## Prerequisites

- Node.js 20+ (managed via nvm)
- npm

## Setup

```bash
# Use correct Node version
nvm use

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on http://localhost:5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Input)
│   ├── survey/          # Survey-specific components
│   └── Layout.jsx       # Main layout with navigation
├── pages/
│   ├── Home.jsx         # Survey list page
│   ├── CreateSurvey.jsx # Survey builder
│   ├── AnswerSurvey.jsx # Public survey form
│   ├── Dashboard.jsx    # Results & analytics
│   └── Documentation.jsx # Help & guides
├── services/
│   └── api.js           # API client
├── App.jsx              # Main app with routing
└── index.css            # TailwindCSS imports
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | - | Backend API URL (optional, uses proxy in dev) |

## API Proxy

In development, API requests to `/api/*` are proxied to `http://localhost:8000` (configured in `vite.config.js`).
