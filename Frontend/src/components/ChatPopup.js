import React, { useState, useEffect, useRef } from "react";
import "./ChatPopup.css"; // Ensure the updated CSS is being used
import { GoogleGenerativeAI } from "@google/generative-ai";

const ChatPopup = ({ chatHistory, setChatHistory }) => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null); // Reference to track the end of the chat

  // Function to scroll down automatically
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Update localStorage whenever chatHistory changes and scroll down
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    scrollToBottom(); // Scroll to the bottom when new message is added
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add the user message to the chat history
    const newChatHistory = [...chatHistory, { message: input, from: "user" }];
    setChatHistory(newChatHistory);
    setInput("");

    try {
      setLoading(true);

      // Define the context about the application
      const appContext = `
      You are an AI chatbot for "AI Recruiter", a comprehensive application designed to assist users in managing job listings and resumes. Here’s a detailed overview of the application and its features:

      **Application Overview:**
      "AI Recruiter" allows users to:
      - Manage job postings
      - Upload and process resumes
      - View job scores and rankings
      - Schedule interviews
      - Fetch and analyze job data from external sources

      **Sidebar Sections:**
      1. **Home**: 
        - **Welcome Message**: Displays a greeting message and the user's name.
        - **Chatbot**: Provides support and answers questions about the application.
        - **Add Job**: Directs users to a form to create a new job posting. Users can input details like:
          - Position Name
          - Company Name
          - Salary Range
          - Work Type (Remote, Hybrid, Onsite)
          - Contract Details (Full-time, Intern, Temporary, Permanent, Consultancy, Part-time, Seasonal, Apprenticeship, Contract)
          - Job Description
          - Payment Currency
        - **Upload Resume**: Allows users to upload resumes in Word or PDF formats.

      2. **Job Listings**:
        - **Search and View**: Users can search for job listings, view details, and apply to jobs.
        - **Rank Resumes**: Collects all resumes for a job listing, ranks them out of 100 using the Gemini API, and provides a list of improvements.

      3. **Resume Section**:
        - **View Resumes**: Displays a list of uploaded resumes.
        - **View Resume Details**: Shows detailed information about a selected resume.
        - **Rank Jobs**: Ranks job listings based on a selected resume, using the Gemini API, and provides a list of improvements.

      4. **View Scores**:
        - **Resume Ranking**: Ranks all resumes based on job listings and provides a list of improvements.

      5. **Schedule Interview**:
        - **Interview Scheduling**: Allows users to schedule interviews using Calendly.

      6. **External Jobs**:
        - **Fetch Jobs**: Retrieves job listings from the Adzuna API for the UK, US, and Europe.
        - **Search and View**: Users can search for jobs, view details, and apply via external links. This section does not support resume ranking.

      7. **Analytics**:
        - **Salary History**: Displays salary history in the US, UK, or Europe as a bar graph.
        - **Salary Histogram**: Shows salary distribution for a specific job title.
        - **Top Companies**: Lists top companies for a specific job title.
        - **Salary Estimation**: Estimates the salary for a specific job title based on user input.

      **Logout**:
        - **Sign Out**: Logs users out and redirects them to the Clerk sign-in page with Google and email authentication.

      Previous messages:
`;

      // Construct the prompt with chat history and application context
      const chatHistoryText = chatHistory
        .map(
          (chat) => `${chat.from === "user" ? "User" : "Bot"}: ${chat.message}`
        )
        .join("\n");

      const prompt = `${appContext}\n${chatHistoryText}\nUser: ${input}\nBot:`;

      // Google Generative AI (Gemini) integration
      const apiKey = process.env.REACT_APP_API_KEY;
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const response = await model.generateContent(prompt);
      const responseText = await response.response.text();

      // Add AI response to chat history
      setChatHistory([
        ...newChatHistory,
        { message: responseText, from: "bot" },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Handle error response (optional)
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="chat-popup">
      <div className="chat-history">
        {chatHistory.map((chat, index) => (
          <div key={index} className={`chat-message ${chat.from}`}>
            {chat.message}
          </div>
        ))}
        <div ref={chatEndRef} /> {/* This is the marker for auto-scroll */}
      </div>
      <div className="chat-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          rows="3" // Adjust the number of rows as necessary
        />
        <button onClick={handleSendMessage} disabled={loading}>
         ⬆ {/* Emoji for send/upload */}
        </button>
      </div>
    </div>
  );
};

export default ChatPopup;
