import React, { useState } from "react";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // Import Menu Icon for the Hamburger
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import JobListings from "./pages/JobListings";
import JobDetails from "./components/JobDetails";
import ResumeDetails from "./components/ResumeDetails";
import ExternalJobDetails from "./components/ExternalJobDetails";
import Resumes from "./pages/Resumes";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import ViewScores from "./pages/ViewScores";
import AddJob from "./pages/AddJob";
import ApplyForm from "./components/ApplyForm";
import ScoreJob from "./pages/ScoreJob";
import RankJobs from "./pages/RankJobs";
import ExternalJobListings from "./pages/ExternalJobListings";
import Analytics from "./pages/Analytics";
import EditJob from "./pages/EditJob";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

// Access Clerk publishable key from environment variables
const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Control Sidebar visibility

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <Router>
        <CssBaseline />
        {/* Show Clerk SignIn before rendering the app */}
        <SignedIn>
          {/* Navbar with Hamburger Menu */}
          <Navbar >
           
          </Navbar>

          <Box sx={{ display: "flex",}}>
            {" "}
            {/* Set margin-top to the height of the Navbar */}
            {isSidebarOpen && <Sidebar />}{" "}
            {/* Conditionally render Sidebar based on toggle */}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                width: isSidebarOpen ? `calc(100% - 240px)` : "100%",
              }}
            >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/add-job" element={<AddJob />} />
                <Route
                  path="/job-listings"
                  element={<JobListings setSelectedJob={setSelectedJob} />}
                />
                <Route
                  path="/job-details"
                  element={<JobDetails job={selectedJob} />}
                />
                <Route path="/score-job" element={<ScoreJob />} />
                <Route
                  path="/resumes"
                  element={<Resumes setSelectedResume={setSelectedResume} />}
                />
                <Route
                  path="/resume-details"
                  element={<ResumeDetails resume={selectedResume} />}
                />
                <Route
                  path="/rank-jobs"
                  element={<RankJobs resume={selectedResume} />}
                />
                <Route
                  path="/apply/:jobId"
                  element={<ApplyForm job={selectedJob} />}
                />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/view-scores" element={<ViewScores />} />
                <Route
                  path="/external-jobs"
                  element={<ExternalJobListings />}
                />
                <Route
                  path="/external-job-details/:jobId"
                  element={<ExternalJobDetails />}
                />
                <Route path="/analytics" element={<Analytics />} />
                <Route
                  path="/edit-job"
                  element={<EditJob job={selectedJob} />}
                />
              </Routes>
            </Box>
          </Box>
        </SignedIn>

        {/* If signed out, redirect to the SignIn page */}
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </Router>
    </ClerkProvider>
  );
}

export default App;
