import React, { useState } from "react";
import "./AddJob.css";

function AddJob() {
  const [job, setJob] = useState({
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

  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({ ...job, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://ai-recruiter-backend.onrender.com/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(job)
      });

      if (!response.ok) {
        throw new Error('Failed to add job');
      }

      // Show toast for success
      setShowToast(true);

      // Reset the form
      setJob({
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

      // Hide toast after a few seconds
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Error adding job:', error);
      setError('Failed to add job. Please try again.');
    }
  };

  return (
    <div className="add-job-container">
      <h2>Create Job Listing</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Position Name</label>
          <input
            type="text"
            name="positionName"
            value={job.positionName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Company Name</label>
          <input
            type="text"
            name="companyName"
            value={job.companyName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={job.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Work Type</label>
          <select
            name="workType"
            value={job.workType}
            onChange={handleChange}
            required
          >
            <option value="">Select Work Type</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Onsite">Onsite</option>
          </select>
        </div>

        <div className="form-group">
          <label>Contract Detail</label>
          <select
            name="contractDetail"
            value={job.contractDetail}
            onChange={handleChange}
            required
          >
            <option value="">Select Contract Type</option>
            <option value="Fulltime">Fulltime</option>
            <option value="Parttime">Parttime</option>
            <option value="Intern">Intern</option>
            <option value="Seasonal">Seasonal</option>
            <option value="Apprenticeship">Apprenticeship</option>
            <option value="Contractor">Contractor</option>
            <option value="Temporary">Temporary</option>
            <option value="Freelance">Freelance</option>
            <option value="Consultancy">Consultancy</option>
          </select>
        </div>
        <div className="form-group">
          <label>Minimum Salary</label>
          <input
            type="number"
            name="salaryMin"
            value={job.salaryMin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Maximum Salary</label>
          <input
            type="number"
            name="salaryMax"
            value={job.salaryMax}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <input
            type="text"
            name="currency"
            value={job.currency}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Job Description</label>
          <textarea
            name="jobDescription"
            value={job.jobDescription}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Add Job
        </button>
      </form>

      {/* Toast notification */}
      {showToast && (
        <div className="toast">Job Listing added successfully!</div>
      )}
    </div>
  );
}

export default AddJob;
