# Survey App - Backend

FastAPI backend for the Survey Application with MongoDB.

## Tech Stack

- **FastAPI** - Modern Python web framework
- **Motor** - Async MongoDB driver
- **Pydantic** - Data validation
- **Uvicorn** - ASGI server

## Prerequisites

- Python 3.11+
- MongoDB 6.0+

## Local Development Setup

### 1. Install MongoDB on Mac

Using Homebrew:

```bash
# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB as a service
brew services start mongodb-community@7.0

# Verify MongoDB is running
mongosh --eval "db.runCommand({ ping: 1 })"
```

### 2. Set Up Python Environment

```bash
cd backend

# Create conda environment
conda create -n survey-app python=3.11 -y

# Activate conda environment
conda activate survey-app

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file (optional - defaults work for local development):

```bash
MONGODB_URL=mongodb://localhost:27017
DATABASE_NAME=survey_app
```

### 4. Run the Server

```bash
# From the backend directory with conda environment activated
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## MongoDB Setup

### Database Structure

The application uses two collections:

#### `surveys` Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  share_id: String (unique),
  questions: [
    {
      id: String,
      text: String,
      type: "text" | "multiple_choice" | "checkbox" | "rating" | "dropdown",
      required: Boolean,
      options: [String],  // for multiple_choice, checkbox, dropdown
      min_rating: Number, // for rating
      max_rating: Number  // for rating
    }
  ],
  created_at: DateTime,
  updated_at: DateTime,
  response_count: Number
}
```

#### `responses` Collection
```javascript
{
  _id: ObjectId,
  survey_id: String,
  answers: [
    {
      question_id: String,
      value: Any
    }
  ],
  submitted_at: DateTime
}
```

### Create Indexes

#### Connect to MongoDB

Open a terminal and run:

```bash
# Connect to local MongoDB using mongosh
mongosh

# Or connect to a specific host/port
mongosh "mongodb://localhost:27017"
```

#### Create the Indexes

Once connected, run the following commands:

```javascript
// Switch to the survey_app database
use survey_app

// Surveys collection indexes
db.surveys.createIndex({ "created_at": -1 })
db.surveys.createIndex({ "share_id": 1 }, { unique: true })

// Responses collection indexes
db.responses.createIndex({ "survey_id": 1 })
db.responses.createIndex({ "survey_id": 1, "submitted_at": -1 })

// Verify indexes
db.surveys.getIndexes()
db.responses.getIndexes()
```

**Note**: The application automatically creates these indexes on startup.

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
| `GET` | `/api/surveys/{id}/analytics` | Get aggregated analytics |

## Testing the API

### Create a Survey

```bash
curl -X POST http://localhost:8000/api/surveys \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Customer Feedback",
    "description": "Help us improve our service",
    "questions": [
      {
        "text": "How satisfied are you?",
        "type": "rating",
        "required": true,
        "min_rating": 1,
        "max_rating": 5
      },
      {
        "text": "What features do you use?",
        "type": "checkbox",
        "required": false,
        "options": ["Dashboard", "Reports", "Settings"]
      }
    ]
  }'
```

### List Surveys

```bash
curl http://localhost:8000/api/surveys
```

### Submit a Response

```bash
curl -X POST http://localhost:8000/api/surveys/{survey_id}/responses \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      {"question_id": "...", "value": 4},
      {"question_id": "...", "value": ["Dashboard", "Reports"]}
    ]
  }'
```
