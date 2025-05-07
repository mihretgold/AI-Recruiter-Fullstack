import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./ResumeDetails.css";

const ResumeDetails = ({ resume }) => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  if (!resume) {
    return <Typography variant="h6">No resume selected.</Typography>;
  }

  const handleRankJobs = () => {
    navigate("/rank-jobs", { state: { resume } });
  };

  return (
    <div className="resume-detail-container">
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Button
          onClick={handleRankJobs}
          variant="contained"
          color="primary"
          className="rank-jobs-button"
        >
          Rank Jobs
        </Button>
        <Typography variant="h4">{resume.name}</Typography>
      </Box>
      <Typography variant="body1" className="resume-text">
        {resume.text}
      </Typography>
    </div>
  );
};

export default ResumeDetails;
