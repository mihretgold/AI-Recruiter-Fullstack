import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import "./JobDetails.css";

function ExternalJobDetails() {
  const { jobId } = useParams();
  const location = useLocation();
  const job = location.state?.job; // Get job details passed from ExternalJobListings

  if (!job) {
    return <p className="job-detail-container">Job details not available!</p>;
  }

  return (
    <div className="job-detail-container">
      <h2>{job.title}</h2>
      <p>
        {job.company.display_name}
      </p>
      <p>
        {job.location.display_name}
      </p>
      <p>
        {job.contract_time || "N/A"}
      </p>
      <p>
        Salary Range: {job.salary_min || "N/A"} -{" "}
        {job.salary_max || "N/A"}
      </p>
      <p>
        {job.description || "N/A"}
      </p>
      <Button
        className="apply-button"
        variant="contained"
        color="primary"
        onClick={() => window.open(job.redirect_url, "_blank")}
      >
        Apply Now
      </Button>
    </div>
  );
}

export default ExternalJobDetails;
