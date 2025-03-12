import React from "react";
import { Container, Typography } from "@mui/material";
import Header from "../../components/Header";

export default function ChildDashboard() {
  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center">
          Child Dashboard
        </Typography>
        <Typography align="center">Welcome to your dashboard!</Typography>
      </Container>
    </>
  );
}