import React from "react";
import { Card, CardContent, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import './Resumes.css'

const Resumes = ({ setSelectedResume }) => {
  const navigate = useNavigate();

  // Fetch the resumes list from localStorage
  const resumesList = JSON.parse(localStorage.getItem("resumesList")) || [];
  console.log(resumesList)
  // Handle clicking on a resume to set it as selected and navigate to details
  const handleResumeClick = (resume) => {
    setSelectedResume(resume);
    navigate("/resume-details");
  };

  return (
    <div className="resume-container">
      <Box>
        <h1>Resumes</h1>
        {resumesList.map((resume, index) => (
          <Card key={resume.id} sx={{ margin: "15px 0" }}>
            <CardContent>
              <Typography variant="h6">{resume.name}</Typography>
              <Button
                onClick={() => handleResumeClick(resume)}
                variant="contained"
              >
                View Resume
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
};

export default Resumes;
