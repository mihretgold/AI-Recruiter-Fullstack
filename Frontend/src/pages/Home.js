import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import addJobSvg from "../assets/add_job.svg";
import uploadResumeSvg from "../assets/upload_resume.svg";
import pdfToText from "react-pdftotext";
import mammoth from "mammoth";
import ChatPopup from "../components/ChatPopup";
import { useUser } from "@clerk/clerk-react";

function Home() {
  const navigate = useNavigate();
  const [resumesList, setResumesList] = useState(() => {
    const savedResumes = localStorage.getItem("resumesList");
    return savedResumes ? JSON.parse(savedResumes) : [];
  });
  const [isChatOpen, setIsChatOpen] = useState(false); // Control chat popup visibility
  const [chatHistory, setChatHistory] = useState(() => {
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const handleAddJobClick = () => {
    navigate("/add-job");
  };

  const handleUploadResumeClick = () => {
    document.getElementById("file-upload").click();
  };

  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const updatedResumesList = [...resumesList];

      for (const file of files) {
        if (!/\.(pdf|docx)$/i.test(file.name)) {
          alert("Only PDF and Word documents are allowed!");
          continue;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
          const text = await extractTextFromFile(
            event.target.result,
            file.type,
            file
          );
          if (text) {
            const resumeId = Date.now();
            const newResume = { id: resumeId, name: file.name, text };
            updatedResumesList.push(newResume);
            setResumesList(updatedResumesList);
            localStorage.setItem(
              "resumesList",
              JSON.stringify(updatedResumesList)
            );
            alert("Resume uploaded successfully and saved!");
          }
        };

        reader.readAsArrayBuffer(file);
      }
    }
  };

  const extractTextFromFile = async (arrayBuffer, fileType, file) => {
    if (fileType === "application/pdf") {
      return await extractTextFromPDF(file);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await extractTextFromWord(arrayBuffer);
    } else {
      console.warn("Unsupported file type for extraction:", fileType);
      return null;
    }
  };

  const extractTextFromPDF = async (file) => {
    try {
      const text = await pdfToText(file);
      return text;
    } catch (error) {
      console.error("Failed to extract text from PDF", error);
      return null;
    }
  };

  const extractTextFromWord = async (arrayBuffer) => {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  };

  // Toggle chat popup visibility
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const { user } = useUser();

  return (
    <div className="home-container">
      <h1>Welcome to the Home Page!</h1>
      <p className="welcome-text">
        Hello, {user?.primaryEmailAddress?.emailAddress}!
      </p>

      <div className="options-wrapper">
        {/* Create Job Listing container */}
        <div className="option-box" onClick={handleAddJobClick}>
          <div className="option-content">
            <img src={addJobSvg} alt="Add Job" className="svg-icon" />
            <button className="home-button">Create Job Listing</button>
          </div>
        </div>

        {/* Upload Resume container */}
        <div className="option-box" onClick={handleUploadResumeClick}>
          <div className="option-content">
            <img
              src={uploadResumeSvg}
              alt="Upload Resume"
              className="svg-icon"
            />
            <input
              type="file"
              id="file-upload"
              accept=".pdf,.docx"
              multiple
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
            <button className="home-button">Upload Resume</button>
          </div>
        </div>
      </div>

      <button className="floating-chat-button" onClick={toggleChat}>
        🤖
      </button>

      {isChatOpen && (
        <ChatPopup chatHistory={chatHistory} setChatHistory={setChatHistory} />
      )}
    </div>
  );
}

export default Home;
