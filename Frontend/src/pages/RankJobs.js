import React, { useEffect, useState } from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  Button,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { GoogleGenerativeAI } from "@google/generative-ai";
import './RankJobs.css'
const RankJobs = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [rankedJobs, setRankedJobs] = useState([]);
  const [error, setError] = useState(null);
  
  const [expandedIndex, setExpandedIndex] = useState(null);
  const navigate = useNavigate();
  // Retrieve resume object from location state
  const resume = location.state?.resume;
  console.log("resume");
  console.log(resume);

  useEffect(() => {
    const fetchAndRankJobs = async () => {
      if (!resume) {
        setError("No resume available.");
        setLoading(false);
        return;
      }

      try {
        // Fetch job lists from localStorage
        const jobLists = JSON.parse(localStorage.getItem("jobsList")) || [];

        console.log("jobLists");
        console.log(jobLists);
        if (jobLists.length === 0) {
          setError("No jobs available to rank.");
          setLoading(false);
          return;
        }

        // Construct the prompt for Gemini
        let prompt = `I have a resume that I would like to evaluate for several job roles. 
        The resume is as follows:

        **Resume Name:**
        ${resume.name}

        **Resume Content:**
        ${resume.text}

        Please rank the following job roles based on how well the resume qualifies for them. For each job, provide the following details in JSON format:

        1. Job Title: [Job title]
        2. Score: [Score out of 100%]
        3. Areas for Improvement: [List areas for improvement]

        Please respond with the results in a structured format (JSON or list and only json format the rest is not needed. Here are the job roles to evaluate:\n`;

        jobLists.forEach((job, index) => {
          prompt += `${index + 1}. Job Title: ${job.positionName}, Company: ${
            job.companyName
          }, Description: ${job.jobDescription}\n\n`;
        });

        const apiKey = process.env.REACT_APP_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);

        const responseText = await result.response.text();
        console.log("responseText");
        console.log(responseText);
        const cleanResponseText = responseText
          .replace(/```json|```/g, "")
          .trim();
        const parsedResults = parseGeminiResponse(cleanResponseText);

        setRankedJobs(parsedResults);
        setLoading(false);
      } catch (err) {
        console.error("Error while ranking jobs:", err);
        setError("An error occurred while ranking jobs.");
        setLoading(false);
      }
    };

    fetchAndRankJobs();
  }, [resume]);

  const parseGeminiResponse = (responseText) => {
    try {
      const rankedJobs = JSON.parse(responseText);
      return rankedJobs.map((job) => ({
        title: job["Job Title"] || "N/A",
        score: job.Score || "N/A",
        areasForImprovement: job["Areas for Improvement"] || [],
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
    return <CircularProgress className="rank-jobs-container" />;
  }

  if (error) {
    return (
      <Typography className="rank-jobs-container" variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <div className="rank-jobs-container">
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Button
          onClick={() => navigate("/resume-details")}
          variant="contained"
          color="primary"
          sx={{ mr: 2 }}
        >
          Back to Resume
        </Button>
        <Typography variant="h4">Ranked Jobs for {resume.name}</Typography>
      </Box>
      <List>
        {rankedJobs.map((job, index) => (
          <ListItem
            key={index}
            sx={{ mb: 2, display: "flex", flexDirection: "column" }}
          >
            <ListItemText
              primary={`${index + 1}. ${job.title}`}
              secondary={`Score: ${job.score}/100%`}
            />
            <Box sx={{ mt: 1 }}>
              <Button
                onClick={() => handleExpandClick(index)}
                variant="contained"
                color="primary"
                sx={{ width: "100%" }}
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
                    {job.areasForImprovement.map((item, subIndex) => (
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

export default RankJobs;
