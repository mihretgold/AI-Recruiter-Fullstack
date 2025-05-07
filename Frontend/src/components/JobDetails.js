import React from "react";
import { useNavigate } from "react-router-dom";
import "./JobDetails.css";

function JobDetails({ job }) {
  const navigate = useNavigate();

  if (!job) {
    return <p className="job-detail-container">Job not found!</p>;
  }

  const handleApplyClick = () => {
    navigate(`/apply/${job.id}`); // Navigate to the apply form with the job ID
  };

  const handleRankResumesClick = () => {
    navigate("/score-job", { state: { job } }); // Pass the job object in the navigation state
  };

  return (
    <div className="job-detail-container">
      <h2>{job.positionName}</h2>
      <p>
        {job.companyName}
      </p>
      <p>
         {job.location}
      </p>
      <p>
       {job.workType}
      </p>
      <p>
         {job.contractDetail}
      </p>
      <p>
        Salary Range: {job.salaryMin} - {job.salaryMax}
      </p>
      <p>
        {job.jobDescription}
      </p>
      <button className="apply-button" onClick={handleApplyClick}>
        Apply Now
      </button>
      <button className="rank-resumes-button" onClick={handleRankResumesClick}>
        Rank Resumes
      </button>
    </div>
  );
}

export default JobDetails;
