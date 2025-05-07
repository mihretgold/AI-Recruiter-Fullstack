import React, { useState } from "react";
import { Button, Grid, Typography } from "@mui/material";

const ResumeUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  };

  const handleUpload = () => {
    console.log(files);
    alert("Resumes Uploaded Successfully!");
  };

  return (
    <div>
      <Typography variant="h5">Upload Resumes</Typography>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        style={{ margin: "20px 0" }}
      />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleUpload}>
            Upload Resumes
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default ResumeUpload;
