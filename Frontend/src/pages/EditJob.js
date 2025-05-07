import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AddJob.css";

function EditJob() {
  const { jobId } = useParams();
  const [editedJob, setEditedJob] = useState({
    positionName: "",
    companyName: "",
    location: "",
    workType: "",
    contractDetail: "",
    salaryMin: "",
    salaryMax: "",
    currency: "",
    jobDescription: "",
  });
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const storedJobs = localStorage.getItem("jobsList");
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      const jobToEdit = jobs.find((j) => j.id === parseInt(jobId, 10));
      if (jobToEdit) {
        setEditedJob(jobToEdit);
      } else {
        console.error("Job not found in the list.");
      }
    } else {
      console.error("No jobs found in localStorage.");
    }
  }, [jobId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedJobs = localStorage.getItem("jobsList");
    if (storedJobs) {
      const jobs = JSON.parse(storedJobs);
      const jobIndex = jobs.findIndex((j) => j.id === editedJob.id);

      if (jobIndex !== -1) {
        jobs[jobIndex] = editedJob;
        localStorage.setItem("jobsList", JSON.stringify(jobs));
        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
          navigate("/job-listings");
        }, 3000);
      } else {
        console.error("Job not found in the list.");
      }
    } else {
      console.error("No jobs found in localStorage.");
    }
  };

  return (
    <div className="add-job-container">
      <h2>Edit Job Listing</h2>
      {editedJob ? (
        <form onSubmit={handleSubmit}>
          {/* Form fields */}
          <div className="form-group">
            <label>Position Name</label>
            <input
              type="text"
              name="positionName"
              value={editedJob.positionName || ""}
              onChange={handleChange}
              required
            />
          </div>
          {/* Other form fields */}
          <button type="submit" className="submit-button">
            Save Changes
          </button>
        </form>
      ) : (
        <p>Loading job details...</p>
      )}
      {showToast && (
        <div className="toast show">Job Listing updated successfully!</div>
      )}
    </div>
  );
}

export default EditJob;
