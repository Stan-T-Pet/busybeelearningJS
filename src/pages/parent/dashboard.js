// File: src/pages/parent/dashboard.js

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";
import ProgressOverview from "../../components/Progress/progressOverview";
import ParentLayout from "@/components/layouts/ParentLayout";

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [childProgress, setChildProgress] = useState([]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "parent") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "parent") {
      fetch(`/api/progress/getChildProgress?parentEmail=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => setChildProgress(data.progress || []))
        .catch((err) => console.error("Error fetching progress:", err));
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

  return (
    <ParentLayout>
    <>
      <Header />
      <Box
        sx={{
          background: "theme.palette.background.default",
          minHeight: "100vh",
          pt: 6,
          pb: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
            Parent Dashboard
          </Typography>
          <Typography variant="h6" align="center" paragraph color="text.secondary">
            Welcome, {session.user.name}
          </Typography>

          {/* Progress Overview */}
          <Box sx={{ mt: 4 }}>
            <ProgressOverview progressData={childProgress} />
          </Box>

          <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="View Profile" onClick={() => router.push("/parent/profile")}>
                <Box textAlign="center">
                  <Button variant="contained" color="secondary" fullWidth>
                    Profile
                  </Button>
                </Box>
              </DynamicCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Logout">
                <Box textAlign="center">
                  <Button variant="outlined" color="error" fullWidth onClick={() => signOut()}>
                    Logout
                  </Button>
                </Box>
              </DynamicCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  </ParentLayout>
  );
}