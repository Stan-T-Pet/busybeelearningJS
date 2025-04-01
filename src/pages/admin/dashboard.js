// File: src/pages/admin/dashboard.js
import React, { useEffect, useState } from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  useTheme 
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const theme = useTheme();

  // Redirect if not authenticated or not an admin.
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  // Fetch metrics from API.
  useEffect(() => {
    if (session && session.user.role === "admin") {
      async function fetchMetrics() {
        try {
          const res = await fetch("/api/admin/metrics");
          if (!res.ok) {
            console.error("Failed to fetch metrics");
            return;
          }
          const data = await res.json();
          setMetrics(data.metrics);
        } catch (error) {
          console.error("Error fetching metrics:", error);
        }
      }
      fetchMetrics();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container 
        maxWidth="xl" 
        sx={{ 
          mt: 4, 
          pb: 4, 
          background: "linear-gradient(to bottom, #f0f8ff, #e6f7ff)", 
          borderRadius: 2, 
          p: 3 
        }}
      >
        <Typography 
          variant="h3" 
          align="center" 
          gutterBottom 
          sx={{ fontWeight: "bold", color: theme.palette.primary.main }}
        >
          Admin Dashboard
        </Typography>
        <Typography 
          variant="h5" 
          align="center" 
          paragraph 
          sx={{ color: theme.palette.text.secondary }}
        >
          Welcome, {session.user.name}!
        </Typography>

        {/* Navigation Buttons */}
        <Box 
          sx={{ 
            display: "flex", 
            justifyContent: "center", 
            flexWrap: "wrap", 
            gap: 2, 
            mb: 4 
          }}
        >
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => router.push("/admin/profile")}
            sx={{ textTransform: "none", fontSize: "1rem" }}
          >
            Profile
          </Button>
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => router.push("/admin/users")}
            sx={{ textTransform: "none", fontSize: "1rem" }}
          >
            Manage Users
          </Button>
          <Button 
            variant="contained" 
            color="info" 
            onClick={() => router.push("/admin/metrics")}
            sx={{ textTransform: "none", fontSize: "1rem" }}
          >
            Metrics
          </Button>
          <Button 
            variant="contained" 
            color="success" 
            onClick={() => router.push("/admin/courses")}
            sx={{ textTransform: "none", fontSize: "1rem" }}
          >
            Courses
          </Button>
          <Button 
            variant="contained" 
            color="warning" 
            onClick={() => router.push("/admin/lessons")}
            sx={{ textTransform: "none", fontSize: "1rem" }}
          >
            Lessons
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={() => router.push("/admin/quizzes")}
            sx={{ textTransform: "none", fontSize: "1rem" }}
          >
            Quizzes
          </Button>
        </Box>

        {/* Metrics Overview */}
        <Grid container spacing={4}>
          {metrics ? (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ boxShadow: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                  <CardContent>
                    <Typography variant="h6" align="center">
                      Total Users
                    </Typography>
                    <Typography variant="h4" align="center" color="primary">
                      {metrics.totalUsers}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ boxShadow: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                  <CardContent>
                    <Typography variant="h6" align="center">
                      Total Parents
                    </Typography>
                    <Typography variant="h4" align="center" color="primary">
                      {metrics.totalParents}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ boxShadow: 4, borderRadius: 3, backgroundColor: "#fff" }}>
                  <CardContent>
                    <Typography variant="h6" align="center">
                      Total Children
                    </Typography>
                    <Typography variant="h4" align="center" color="primary">
                      {metrics.totalChildren}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              {/* Additional metric cards can be added here */}
            </>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center">
                No metrics available.
              </Typography>
            </Grid>
          )}
        </Grid>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={() => signOut()} 
            sx={{ textTransform: "none" }}
          >
            Log out
          </Button>
        </Box>
      </Container>
    </>
  );
}
