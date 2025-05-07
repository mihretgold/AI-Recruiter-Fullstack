import React, { useState } from "react";

function JobFormPage() {
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

  const handleChange = (e) => {
    setJob({ ...job, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(job);
  };

  return (
    <div>
      <h2>Create Job Listing</h2>
      <form onSubmit={handleSubmit}>
        <label>Position Name:</label>
        <input
          type="text"
          name="positionName"
          value={job.positionName}
          onChange={handleChange}
        />

        <label>Company Name:</label>
        <input
          type="text"
          name="companyName"
          value={job.companyName}
          onChange={handleChange}
        />

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={job.location}
          onChange={handleChange}
        />

        <label>Work Type:</label>
        <select name="workType" value={job.workType} onChange={handleChange}>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Onsite">Onsite</option>
        </select>

        <label>Contract Detail:</label>
        <select
          name="contractDetail"
          value={job.contractDetail}
          onChange={handleChange}
        >
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

        <label>Minimum Salary:</label>
        <input
          type="text"
          name="salaryMin"
          value={job.salaryMin}
          onChange={handleChange}
        />

        <label>Maximum Salary:</label>
        <input
          type="text"
          name="salaryMax"
          value={job.salaryMax}
          onChange={handleChange}
        />

        <label>Currency:</label>
        <input
          type="text"
          name="currency"
          value={job.currency}
          onChange={handleChange}
        />

        <label>Job Description:</label>
        <textarea
          name="jobDescription"
          value={job.jobDescription}
          onChange={handleChange}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default JobFormPage;
