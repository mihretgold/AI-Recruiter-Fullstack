# AI Recruiter Backend

This is the backend service for the AI Recruiter application, built with Flask and Firebase Firestore.

## Features

- Job posting management
- Job search functionality
- RESTful API endpoints
- Firebase Firestore integration
- CORS enabled for frontend integration

## Prerequisites

- Python 3.8 or higher
- Firebase project with Firestore enabled
- Firebase service account key

## Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Create and activate virtual environment**
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Firebase Setup**
   - Go to Firebase Console
   - Create a new project or select existing one
   - Go to Project Settings > Service Accounts
   - Generate new private key
   - Save as `serviceAccountKey.json` in the backend directory

5. **Create Firestore Database**
   - In Firebase Console, go to Firestore Database
   - Click "Create Database"
   - Choose "Start in test mode"
   - Select a location
   - Click "Enable"

## Running the Application

1. **Start the Flask server**
```bash
python app.py
```
The server will start at `http://localhost:5000`

## API Endpoints

### Jobs

#### Add a Job
```http
POST /api/jobs
Content-Type: application/json

{
    "positionName": "Senior Software Engineer",
    "companyName": "Tech Corp",
    "location": "New York",
    "workType": "Remote",
    "contractDetail": "Fulltime",
    "salaryMin": 100000,
    "salaryMax": 150000,
    "currency": "USD",
    "jobDescription": "Looking for an experienced software engineer..."
}
```

#### Get All Jobs
```http
GET /api/jobs
```

#### Search Jobs
```http
GET /api/jobs?search=query
```

## Testing

Run the test suite to verify all endpoints:
```bash
python test_endpoints.py
```

The test suite will:
1. Test adding a new job
2. Test retrieving all jobs
3. Test searching jobs

## Project Structure

```
backend/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── serviceAccountKey.json # Firebase credentials
├── test_endpoints.py     # API endpoint tests
└── repositories/
    └── job_repository.py # Firebase job operations
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 500: Server Error

All responses include a `success` boolean and either:
- `data` for successful responses
- `error` for error responses

## Security

- Firebase service account key is gitignored
- CORS is enabled for frontend integration
- Input validation is performed on all endpoints

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 