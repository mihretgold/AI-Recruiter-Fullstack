# AI Recruiter Fullstack Application

A fullstack job recruitment platform built with React and Flask, featuring AI-powered job matching and management.

## Project Overview

This project consists of two main parts:
- Frontend: React application with Material-UI
- Backend: Flask API with Firebase Firestore

## Quick Start

1. **Clone the repository**
```bash
git clone <repository-url>
cd AI-Recruiter-Fullstack
```

2. **Setup Backend**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Mac/Linux
pip install -r requirements.txt
```

3. **Setup Frontend**
```bash
cd frontend
npm install
```

4. **Configure Firebase**
- Create a Firebase project
- Enable Firestore
- Add your service account key to `backend/serviceAccountKey.json`

5. **Run the Application**
```bash
# Terminal 1 - Backend
cd backend
python app.py

# Terminal 2 - Frontend
cd frontend
npm start
```

Visit `http://localhost:3000` to see the application.

## Project Structure

```
AI-Recruiter-Fullstack/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── README.md
│
├── backend/           # Flask backend application
│   ├── repositories/
│   ├── app.py
│   └── README.md
│
└── README.md         # This file
```

## Features

### Frontend
- Modern, responsive UI with Material-UI
- Job posting and management
- Job search and filtering
- Real-time updates
- User-friendly forms

### Backend
- RESTful API endpoints
- Firebase Firestore integration
- Job data management
- Search functionality
- CORS enabled

## Documentation

- [Frontend Documentation](./frontend/README.md)
- [Backend Documentation](./backend/README.md)

## Development

### Prerequisites
- Node.js 14+ and npm
- Python 3.8+
- Firebase account
- Git

### Environment Setup
1. **Backend Environment**
   - Python virtual environment
   - Firebase service account
   - Required Python packages

2. **Frontend Environment**
   - Node.js and npm
   - Required npm packages
   - Environment variables

## Testing

### Backend Tests
```bash
cd backend
python test_endpoints.py
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment
- Deploy to a Python-compatible hosting service
- Set up environment variables
- Configure Firebase credentials

### Frontend Deployment
- Build the React application
- Deploy to a static hosting service
- Configure environment variables

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/AI-Recruiter-Fullstack](https://github.com/yourusername/AI-Recruiter-Fullstack) 