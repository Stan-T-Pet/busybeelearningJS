// file: pages\admin\images\index.js

/* placeholder */

import React from "react";
import Header from "@/components/Header";
import { Container, Typography } from "@mui/material";

export default function AdminImagesPage() {
  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Images Dashboard
        </Typography>
        <Typography variant="body1">
          This is a placeholder for the admin images index page.
        </Typography>
      </Container>
    </>
  );
}
