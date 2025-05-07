import React from "react";
import { InlineWidget } from "react-calendly"; // Import the Calendly widget component
import './ScheduleInterview.css'

const ScheduleInterview = () => {
  return (
    <div className="schedule-interview-container" style={{ padding: "20px" }}>
      <h2>Schedule an Interview</h2>
      <p>
        Please choose a suitable time for your interview from the calendar
        below.
      </p>

      {/* Embed the Calendly InlineWidget */}
      <InlineWidget
        url="https://calendly.com/mihretagegnehu2/30min" // Replace with your actual Calendly URL
        styles={{ height: "700px", minWidth: "320px" }} // Customize height and width if needed
      />
    </div>
  );
};

export default ScheduleInterview;
