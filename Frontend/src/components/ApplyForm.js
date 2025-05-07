import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ApplyForm.css";
import pdfToText from "react-pdftotext"; // Import react-pdftotext
import mammoth from "mammoth"; // For Word doc parsing

function ApplyForm() {
  const { jobId } = useParams(); // Get the job ID from the route
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    linkedIn: "",
    resume: "",
    reason: "",
    gender: "",
    diversity: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!/\.(pdf|docx)$/i.test(file.name)) {
      alert("Only PDF and Word documents are allowed!");
      return;
    }

    // Use react-pdftotext if it's a PDF
    if (file.type === "application/pdf") {
      const text = await extractTextFromPDF(file);
      if (text) {
        setFormData({ ...formData, resume: text });
        alert("PDF Resume uploaded and text extracted successfully!");
      }
    } else {
      // Use mammoth for Word documents
      const reader = new FileReader();
      reader.onload = async (event) => {
        const text = await extractTextFromFile(event.target.result, file.type);
        if (text) {
          setFormData({ ...formData, resume: text });
          alert("Word Resume uploaded and text extracted successfully!");
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const extractTextFromFile = async (arrayBuffer, fileType) => {
    if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await extractTextFromWord(arrayBuffer);
    } else {
      return null;
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const text = await pdfToText(file);
      return text;
    } catch (error) {
      console.error("Failed to extract text from PDF:", error);
      return null;
    }
  };

  const extractTextFromWord = async (arrayBuffer) => {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add job ID to the form data
    const application = { ...formData, jobId };

    // Save to localStorage
    const savedApplications =
      JSON.parse(localStorage.getItem("jobApplications")) || [];
    savedApplications.push(application);
    localStorage.setItem("jobApplications", JSON.stringify(savedApplications));

    alert("Application submitted successfully!");
    navigate("/"); // Redirect to the home page after submission
  };

  return (
    <div className="apply-form-container">
      <h2>Apply for Job</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>LinkedIn Profile:</label>
          <input
            type="text"
            name="linkedIn"
            value={formData.linkedIn}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Upload Resume (PDF/DOCX):</label>
          <input type="file" onChange={handleFileUpload} accept=".pdf,.docx" />
        </div>
        <div>
          <label>Why do you want to join the company? (500 words max):</label>
          <textarea
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            maxLength={500}
            required
          />
        </div>
        <div>
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Non-binary">Non-binary</option>
            <option value="Prefer not to say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <label>Diversity (Optional):</label>
          <textarea
            name="diversity"
            value={formData.diversity}
            onChange={handleInputChange}
            placeholder="Any diversity or special consideration?"
          />
        </div>
        <button type="submit">Submit Application</button>
      </form>
    </div>
  );
}

export default ApplyForm;
