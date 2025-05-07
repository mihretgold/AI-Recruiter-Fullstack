import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import "./JobListings.css";

function ExternalJobListings() {
  const [jobsList, setJobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const urls = [
          `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${process.env.REACT_APP_JOB_API_APPID}&app_key=${process.env.REACT_APP_JOB_API_KEY}&results_per_page=10&what=software`,
          `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${process.env.REACT_APP_JOB_API_APPID}&app_key=${process.env.REACT_APP_JOB_API_KEY}&results_per_page=10&what=software`,
          `https://api.adzuna.com/v1/api/jobs/de/search/1?app_id=${process.env.REACT_APP_JOB_API_APPID}&app_key=${process.env.REACT_APP_JOB_API_KEY}&results_per_page=10&what=software`,
        ];

        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data = await Promise.all(
          responses.map((response) => response.json())
        );

        const combinedJobs = data.flatMap((regionData) => regionData.results);
        setJobsList(combinedJobs);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobsList.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.display_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      job.location.display_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="job-listing-container loading-spinner">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div className="job-listing-container">Error: {error}</div>;
  }

  return (
    <div className="job-listing-container">
      <h1>Software Related Job Listings (US, UK, Europe)</h1>
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
              <Card
                sx={{
                  boxShadow: 3,
                  borderRadius: 2,
                  padding: 2,
                  "&:hover": { boxShadow: 6 },
                }}
                onClick={() =>
                  navigate(`/external-job-details/${job.id}`, {
                    state: { job },
                  })
                }
              >
                <CardContent>
                  <Typography variant="h6">{job.title}</Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                    {job.company.display_name} ({job.location.display_name})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {job.contract_time || "N/A"}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </div>
  );
}

export default ExternalJobListings;
