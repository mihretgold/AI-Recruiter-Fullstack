# AI Recruiter Frontend

The frontend application for the AI Recruiter platform, built with React and Material-UI.

## Features

- Modern, responsive user interface
- Job posting and management
- Real-time job search and filtering
- Material-UI components
- Form validation
- API integration with backend

## Prerequisites

- Node.js 14 or higher
- npm 6 or higher
- Modern web browser

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Environment Variables**
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:5000
```

3. **Start development server**
```bash
npm start
```
The application will be available at `http://localhost:3000`

## Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── ...
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── AddJob.js
│   │   ├── JobListings.js
│   │   └── ...
│   ├── pages/         # Page components
│   │   ├── Home.js
│   │   └── ...
│   ├── services/      # API services
│   │   └── api.js
│   ├── utils/         # Utility functions
│   │   └── helpers.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Component Documentation

### AddJob Component
- Form for adding new job postings
- Input validation
- API integration for job submission

### JobListings Component
- Displays list of available jobs
- Search and filter functionality
- Real-time updates

## API Integration

The frontend communicates with the backend through the following endpoints:

### Jobs
- `POST /api/jobs` - Add new job
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs?search=query` - Search jobs

## Styling

The application uses Material-UI for styling. Key features:
- Responsive design
- Theme customization
- Component-based styling
- Dark/Light mode support

## Testing

Run the test suite:
```bash
npm test
```

## Building for Production

1. **Create production build**
```bash
npm run build
```

2. **Test production build locally**
```bash
serve -s build
```

## Deployment

1. **Build the application**
```bash
npm run build
```

2. **Deploy the `build` folder to your hosting service**

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
