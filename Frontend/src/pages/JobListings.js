import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./JobListings.css";

function JobListings({ setSelectedJob }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://ai-recruiter-backend.onrender.com/api/jobs');
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const result = await response.json();
        // Check if the response has a data property
        const jobsData = result.jobs || result;
        setJobs(Array.isArray(jobsData) ? jobsData : []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to load jobs. Please try again later.');
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (job) => {
    // Navigate to the edit job page with the job's ID as a query parameter
    window.location.href = `/edit-job?id=${job.id}`;
  };

  const handleDelete = (jobId) => {
    const updatedJobs = jobs.filter((job) => job.id !== jobId);
    setJobs(updatedJobs);
  };

  if (loading) {
    return (
      <div className="job-listing-container" style={{ textAlign: 'center', padding: '20px' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-listing-container">
        <Alert severity="error">{error}</Alert>
      </div>
    );
  }

  // Safe filtering function
  const filteredJobs = jobs.filter(job => {
    if (!job) return false;
    const searchLower = searchQuery.toLowerCase();
    return (
      (job.positionName && job.positionName.toLowerCase().includes(searchLower)) ||
      (job.companyName && job.companyName.toLowerCase().includes(searchLower)) ||
      (job.location && job.location.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="job-listing-container">
      <h1>Job Listings</h1>
      <div className="search-bar">
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          InputProps={{
            startAdornment: <SearchIcon />,
          }}
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>
      <Grid container spacing={2}>
        {filteredJobs.length === 0 ? (
          <Grid item xs={12}>
            <Typography variant="body1" style={{ textAlign: 'center', padding: '20px' }}>
              {jobs.length === 0 ? 'No jobs available' : 'No jobs match your search'}
            </Typography>
          </Grid>
        ) : (
          filteredJobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job.id || Math.random()}>
              <Link to="/job-details" style={{ textDecoration: "none" }}>
                <Card
                  onClick={() => setSelectedJob(job)}
                  sx={{
                    boxShadow: 3,
                    borderRadius: 2,
                    padding: 2,
                    "&:hover": { boxShadow: 6 },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{job.positionName || 'No Title'}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {job.companyName || 'No Company'} ({job.location || 'No Location'})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {job.workType || 'No Work Type'}
                    </Typography>
                    <div className="job-actions">
                      {/* <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(job.id)}
                      >
                        Delete
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}

export default JobListings;
