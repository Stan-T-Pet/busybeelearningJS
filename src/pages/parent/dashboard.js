// File: src/pages/parent/dashboard.js
import React, { useEffect, useState } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import ProgressOverview from "../../components/Progress/progressOverview";

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [childProgress, setChildProgress] = useState([]);

  // Redirect if not logged in or not a parent.
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "parent") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  // Fetch progress details for children.
  useEffect(() => {
    if (session && session.user && session.user.role === "parent") {
      const fetchProgress = async () => {
        try {
          const response = await fetch(
            `/api/progress/getChildProgress?parentEmail=${session.user.email}`
          );
          if (!response.ok) {
            console.error("Failed to fetch progress");
            return;
          }
          const data = await response.json();
          setChildProgress(data.progress || []);
        } catch (error) {
          console.error("Error fetching progress:", error);
        }
      };
      fetchProgress();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!session || session?.user?.role !== "parent") {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          You must be logged in as a **Parent** to access this page.
        </Typography>
        <Box mt={2} textAlign="center">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Parent Dashboard
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Welcome, {session.user.name}!
        </Typography>
      </Container>
    </>
  );
}
