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
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);

  // Redirect if user is not authenticated or not an admin.
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  // Fetch metrics from API (example endpoint)
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
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Welcome, {session.user.name}!
        </Typography>

        {/* Navigation Buttons */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/admin/profile")}
            sx={{ mr: 2 }}
          >
            Profile
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push("/admin/users")}
            sx={{ mr: 2 }}
          >
            Manage Users
          </Button>
          <Button
            variant="contained"
            color="info"
            onClick={() => router.push("/admin/metrics")}
          >
            Metrics
          </Button>
        </Box>

        {/* Metrics Overview */}
        <Grid container spacing={3}>
          {metrics ? (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
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
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
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
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
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
              {/* Add more cards as needed */}
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
          <Button variant="outlined" color="error" onClick={() => signOut()}>
            Log out
          </Button>
        </Box>
      </Container>
    </>
  );
}
