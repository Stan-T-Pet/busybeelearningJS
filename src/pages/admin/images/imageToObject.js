// file:  pages\admin\images\imageToObject.js

/* placeholder */
import React from "react";
import Header from "@/components/Header";
import { Container, Typography } from "@mui/material";

export default function ImageToObjectPage() {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Image to Object Conversion
        </Typography>
        <Typography variant="body1">
          This is a placeholder for the image-to-object conversion tool.
        </Typography>
      </Container>
    </>
  );
}
