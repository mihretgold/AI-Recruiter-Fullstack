import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu"; // For the three-line drawer icon
import SmartToyIcon from "@mui/icons-material/SmartToy"; // Robot Icon for AI Recruiter
import { useUser } from "@clerk/clerk-react"; // Clerk hook to get the user's email
import "./NavBar.css";

const Navbar = ({ toggleSidebar }) => {
  // Fetch the current user's email from Clerk
  const { user } = useUser();

  // Extract the first letter of the user's email
  const userInitial = user?.emailAddress?.[0]?.toUpperCase() || "";

  return (
    <AppBar position="fixed" className="navbar">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left side: AI Recruiter Icon and Title */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <SmartToyIcon sx={{ mr: 1 }} /> {/* AI Icon */}
          <Typography variant="h6" component="div">
            AI - Recruiter
          </Typography>
        </Box>

        {/* Right side: User Avatar */}
        {user && (
          <Avatar sx={{ bgcolor: "#6c63ff", color: "#fff" }}>
            {userInitial}
          </Avatar>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
