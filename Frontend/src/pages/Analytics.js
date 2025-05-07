import React, { useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import BusinessIcon from "@mui/icons-material/Business";
import MoneyIcon from "@mui/icons-material/Money";
import "./Analytics.css";

// Register necessary chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Analytics() {
  const [salaryData, setSalaryData] = useState(null);
  const [histogramData, setHistogramData] = useState(null);
  const [topCompanies, setTopCompanies] = useState(null);
  const [jobTitle, setJobTitle] = useState(""); // For Jobsworth input
  const [salaryEstimate, setSalaryEstimate] = useState(null);
  const [region, setRegion] = useState("gb"); // Region for API (UK, US, Europe)
  const [histogramJob, setHistogramJob] = useState("software engineer");
  const [topCompaniesJob, setTopCompaniesJob] = useState("software engineer");

  const fetchHistoricalData = async () => {
    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/${region}/history?app_id=${
          process.env.REACT_APP_JOB_API_APPID
        }&app_key=${process.env.REACT_APP_JOB_API_KEY}&location0=${
          region === "gb" ? "UK" : region
        }&category=it-jobs&content-type=application/json`
      );
      const data = await response.json();
      setSalaryData(data.month);
    } catch (error) {
      console.error("Error fetching historical data:", error);
    }
  };

  const fetchHistogramData = async () => {
    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/${region}/histogram?app_id=${
          process.env.REACT_APP_JOB_API_APPID
        }&app_key=${process.env.REACT_APP_JOB_API_KEY}&location0=${
          region === "gb" ? "UK" : region
        }&what=${histogramJob}&content-type=application/json`
      );
      const data = await response.json();
      setHistogramData(data.histogram);
    } catch (error) {
      console.error("Error fetching histogram data:", error);
    }
  };

  const fetchTopCompanies = async () => {
    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/${region}/top_companies?app_id=${process.env.REACT_APP_JOB_API_APPID}&app_key=${process.env.REACT_APP_JOB_API_KEY}&what=${topCompaniesJob}&content-type=application/json`
      );
      const data = await response.json();
      setTopCompanies(data.leaderboard);
    } catch (error) {
      console.error("Error fetching top companies:", error);
    }
  };

  const fetchJobsworthEstimate = async () => {
    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/${region}/jobsworth?app_id=${process.env.REACT_APP_JOB_API_APPID}&app_key=${process.env.REACT_APP_JOB_API_KEY}&title=${jobTitle}&description=Backbone,HTML5,CSS3&content-type=application/json`
      );
      const data = await response.json();
      setSalaryEstimate(data.salary);
    } catch (error) {
      console.error("Error fetching jobsworth data:", error);
    }
  };

  const salaryChartData = salaryData
    ? {
        labels: Object.keys(salaryData),
        datasets: [
          {
            label: "Salary",
            data: Object.values(salaryData),
            backgroundColor: "rgba(75,192,192,0.6)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
          },
        ],
      }
    : null;

  const histogramChartData = histogramData
    ? {
        labels: Object.keys(histogramData),
        datasets: [
          {
            label: "Vacancies",
            data: Object.values(histogramData),
            backgroundColor: "rgba(153,102,255,0.6)",
            borderColor: "rgba(153,102,255,1)",
            borderWidth: 1,
          },
        ],
      }
    : null;

  return (
    <div className="analytics-container">
      <Typography variant="h4" gutterBottom>
        Analytics Dashboard
      </Typography>

      <Grid container spacing={3} direction="column">
        <Grid item>
          <FormControl fullWidth>
            <InputLabel>Region</InputLabel>
            <Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              label="Region"
            >
              <MenuItem value="gb">UK</MenuItem>
              <MenuItem value="us">US</MenuItem>
              <MenuItem value="eu">Europe</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<HistoryIcon />}
            fullWidth
            onClick={fetchHistoricalData}
          >
            Get IT Jobs Salary History
          </Button>
          {salaryChartData && <Bar data={salaryChartData} />}
        </Grid>

        <Grid item>
          <TextField
            label="Job Title for Histogram"
            value={histogramJob}
            onChange={(e) => setHistogramJob(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<MoneyIcon />}
            fullWidth
            onClick={fetchHistogramData}
          >
            Get Salary Histogram
          </Button>
          {histogramChartData && <Bar data={histogramChartData} />}
        </Grid>

        <Grid item>
          <TextField
            label="Job Title for Top Companies"
            value={topCompaniesJob}
            onChange={(e) => setTopCompaniesJob(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<BusinessIcon />}
            fullWidth
            onClick={fetchTopCompanies}
          >
            Get Top Companies
          </Button>
          {topCompanies && (
            <ul>
              {topCompanies.map((company, index) => (
                <li key={index}>
                  {company.canonical_name}: {company.count} vacancies, Avg
                  Salary: £{company.average_salary}
                </li>
              ))}
            </ul>
          )}
        </Grid>

        <Grid item>
          <Typography variant="h6">Jobsworth Salary Prediction</Typography>
          <TextField
            label="Job Title"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            fullWidth
            onClick={fetchJobsworthEstimate}
            style={{ marginTop: "10px" }}
          >
            Get Salary Estimate
          </Button>
          {salaryEstimate && (
            <Typography variant="body1" style={{ marginTop: "10px" }}>
              Estimated Salary: £{salaryEstimate}
            </Typography>
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default Analytics;
