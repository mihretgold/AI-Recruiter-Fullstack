import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import "./JobListings.css";

function JobListings({ setSelectedJob }) {
  const [jobsList, setJobsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobsList");
    if (storedJobs) {
      setJobsList(JSON.parse(storedJobs));
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEdit = (job) => {
    // Navigate to the edit job page with the job's ID as a query parameter
    window.location.href = `/edit-job?id=${job.id}`;
  };

  const handleDelete = (jobId) => {
    const updatedJobs = jobsList.filter((job) => job.id !== jobId);
    setJobsList(updatedJobs);
    localStorage.setItem("jobsList", JSON.stringify(updatedJobs));
  };

  const filteredJobs = jobsList.filter(
    (job) =>
      job.positionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <p>No jobs available</p>
        ) : (
          filteredJobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
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
                    <Typography variant="h6">{job.positionName}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                      {job.companyName} ({job.location})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {job.workType}
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
