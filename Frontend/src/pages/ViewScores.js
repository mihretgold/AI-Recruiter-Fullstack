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
} from "@mui/material";
import { GoogleGenerativeAI } from "@google/generative-ai";
import './ViewScores.css';

const ViewScores = () => {
  const [loading, setLoading] = useState(true);
  const [rankedResumes, setRankedResumes] = useState([]);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchAndRankResumes = async () => {
      try {
        // Fetch resumes from localStorage
        const resumesList =
          JSON.parse(localStorage.getItem("resumesList")) || [];

        if (resumesList.length === 0) {
          setError("No resumes available to rank.");
          setLoading(false);
          return;
        }

        // Construct prompt for Gemini to act as ATS parser
        let prompt = `I have a list of resumes that I would like to evaluate for their suitability for a software engineering position. 
        Please evaluate each resume using the following criteria:
        - Relevant experience (years in the industry, similar roles).
        - Technical skills (e.g., JavaScript, React, Python, and problem-solving).
        - Education and certifications.
        - Keywords matching typical job requirements for a software engineer.

        For each resume, return the following details in the format below:
        1. Resume Title: [Resume title]
        2. Score: [Score out of 100%]
        3. Areas for Improvement: [List areas for improvement]

        Please respond with the results in a structured format (JSON or list) and only json response nothing else. The resumes are:\n`;

        // Loop through each resume and add to the prompt
        resumesList.forEach((resume, index) => {
          prompt += `${index + 1}. Resume title: ${
            resume.name
          }\nResume content:\n${resume.text}\n\n`;
        });

        // Call the Gemini API
        const apiKey = process.env.REACT_APP_API_KEY; // Use REACT_APP prefix
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);

        // Assuming the result is coming as text, process it
        const responseText = await result.response.text();

        // Clean up any extraneous backticks or markdown formatting
        const cleanResponseText = responseText
          .replace(/```json|```/g, "")
          .trim();

        // Parse the result
        const parsedResults = parseGeminiResponse(cleanResponseText);

        // Sort the resumes by score (highest first)
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
  }, []);

  // Function to parse Gemini API response (Assuming it's a simple text with scores and suggestions)
  const parseGeminiResponse = (responseText) => {
    try {
      // Parse the response as JSON
      const rankedResumes = JSON.parse(responseText);

      // Map over the resumes and extract relevant details
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
    return <CircularProgress className="view-scores-container" />;
  }

  if (error) {
    return (
      <Typography className="view-scores-container" variant="h6" color="error">
        {error}
      </Typography>
    );
  }

  return (
    <div className="view-scores-container">
      <Typography variant="h4">Ranked Resumes (Scored like an ATS)</Typography>
      <List>
        {rankedResumes.map((resume, index) => (
          <ListItem key={index} sx={{ mb: 2 }}>
            <ListItemText
              primary={`${index + 1}. ${resume.title}`}
              secondary={`Score: ${resume.score}/100%`}
            />
            <Button
              onClick={() => handleExpandClick(index)}
              variant="contained"
              color="primary"
            >
              {expandedIndex === index
                ? "Hide Improvements"
                : "Show Improvements"}
            </Button>
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

export default ViewScores;