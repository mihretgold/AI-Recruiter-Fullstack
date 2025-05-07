import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Divider,
  Drawer,
  Box,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import { SignOutButton } from "@clerk/clerk-react"; // Use the SignOutButton component
import "./Sidebar.css"; // Your custom CSS file

const Sidebar = () => {
  return (
    <Drawer
      className="side-bar-container"
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#EBEBEC",
          paddingTop: "64px", // Push sidebar content below the navbar
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <List>
          <ListItem button component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/job-listings">
            <ListItemText primary="Job Listings" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/resumes">
            <ListItemText primary="Resumes" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/view-scores">
            <ListItemText primary="View Scores" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/schedule-interview">
            <ListItemText primary="Schedule Interview" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/external-jobs">
            <ListItemText primary="External Jobs" />
          </ListItem>
          <Divider />
          <ListItem button component={Link} to="/analytics">
            <ListItemText primary="Analytics" />
          </ListItem>
          <Divider />

          {/* Logout Button */}
          <ListItem>
            <SignOutButton>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#6C63FF", color: "white" }}
                fullWidth
              >
                Logout
              </Button>
            </SignOutButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
