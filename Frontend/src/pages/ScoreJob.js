import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Button,
  Card,
  CardContent,
  Collapse,
  Box,
} from "@mui/material";
import { useLocation } from "react-router-dom"; // Import useLocation for accessing navigation state
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./ScoreJob.css"; // You can create a new CSS file or reuse the existing one

const ScoreJob = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [rankedResumes, setRankedResumes] = useState([]);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Retrieve job object from location state
  const job = location.state?.job;

  useEffect(() => {
    const fetchAndRankResumes = async () => {
      if (!job) {
        setError("No job details available.");
        setLoading(false);
        return;
      }

      try {
        // Fetch resumes from localStorage for the specific job
        const applications =
          JSON.parse(localStorage.getItem("jobApplications")) || [];
        console.log('Applications');
        console.log(applications);
        console.log('JobId');
        console.log(job.id)
        const filteredApplications = applications.filter((app) => {
          // Ensure both jobId and job.id are strings for comparison
          const appJobId = String(app.jobId);
          const jobId = String(job.id);

          const isMatch = appJobId === jobId;
          console.log(
            `Filtering - App ID: ${appJobId}, Job ID: ${jobId}, Match: ${isMatch}`
          );
          return isMatch;
        });
        console.log('Filtered Applications');
        console.log(filteredApplications);
        console.log(job);

        if (filteredApplications.length === 0) {
          setError("No resumes available to rank for this job.");
          setLoading(false);
          return;
        }

        // Construct prompt for the ranking system to consider job-specific values
        let prompt = `I have a list of resumes that I would like to evaluate for a specific job role. 
        The job role is ${job.positionName} at ${job.companyName}. Here are the details of the job:

        **Job Description:**
        ${job.jobDescription}

        Please rank the resumes based on the following criteria:
        - Relevant experience for the role.
        - Technical skills (e.g., relevant programming languages).
        - How well they align with the company’s values.
        - Their response to why they want to join the company.

        For each resume, return the following details in the format below:
        1. Resume Title: [Resume title]
        2. Score: [Score out of 100%]
        3. Areas for Improvement: [List areas for improvement]
         Please respond with the results in a structured format (JSON or list) and only json response nothing else.
        The resumes are:\n`;

        filteredApplications.forEach((app, index) => {
          prompt += `${index + 1}. Resume Title: ${
            app.fullName // Assuming fullName is the correct property
          }\nResume Content:\n${app.resume}\nWhy Join Answer:\n${
            app.reason // Assuming reason is the correct property
          }\n\n`;
        });

        // Call the Gemini API (or similar service)
        const apiKey = process.env.REACT_APP_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);

        const responseText = await result.response.text();
        console.log(responseText);
        const cleanResponseText = responseText
          .replace(/```json|```/g, "")
          .trim();
        const parsedResults = parseGeminiResponse(cleanResponseText);

        // Sort the resumes by score
        const sortedResumes = parsedResults.sort((a, b) => b.score - a.score);

        setRankedResumes(sortedResumes);
        setLoading(false);
      } catch (err) {
        console.error("Error while ranking resumes:", err);
        setError("An error occurred while processing resumes.");
        setLoading(false);
      }
    };

    fetchAndRankResumes();
  }, [job]);

  const parseGeminiResponse = (responseText) => {
    try {
      const rankedResumes = JSON.parse(responseText);
      return rankedResumes.map((resume) => ({
        title: resume["Resume Title"] || "N/A",
        score: resume.Score || "N/A",
        suggestion: resume["Areas for Improvement"] || [],
      }));
    } catch (err) {
      console.error("Error parsing the response:", err);
      return [];
    }
  };


  const handleExpandClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return <CircularProgress className="score-job-container" />;
  }

  if (error) {
    return (
      <Typography className="score-job-container" variant="h6" color="error">
        {error}
      </Typography>
    );
  }
  console.log('JOb');
  console.log(job);
  
  return (
    <div className="score-job-container">
      <Typography variant="h4">
        Ranked Resumes (Scored for {job.positionName})
      </Typography>
      <List>
        {rankedResumes.map((resume, index) => (
          <ListItem
            key={index}
            sx={{ mb: 2, display: "flex", flexDirection: "column" }}
          >
            <ListItemText
              primary={`${index + 1}. ${resume.title}`}
              secondary={`Score: ${resume.score}/100%`}
            />
            <Box sx={{ mt: 1 }}>
              {" "}
              {/* Add space between title/score and button */}
              <Button
                onClick={() => handleExpandClick(index)}
                variant="contained"
                color="primary"
                sx={{ width: "100%" }} // Make the button full width
              >
                {expandedIndex === index
                  ? "Hide Improvements"
                  : "Show Improvements"}
              </Button>
            </Box>
            <Collapse in={expandedIndex === index}>
              <Card variant="outlined" sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6">Areas for Improvement:</Typography>
                  <List>
                    {resume.suggestion.map((item, subIndex) => (
                      <ListItem key={subIndex}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Collapse>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ScoreJob;
