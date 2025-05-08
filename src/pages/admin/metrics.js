// File: src/pages/admin/metrics.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import Header from "../../components/Header";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import AdminLayout from "@/components/Layouts/AdminLayout";

export default function AdminMetrics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated or not an admin.
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  // Fetch metrics data from backend.
  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    }
    if (session && session.user.role === "admin") {
      fetchMetrics();
    }
  }, [session]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading metrics...
        </Typography>
      </Container>
    );
  }

  return (
    <AdminLayout>
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Dashboard Metrics
        </Typography>
        {metrics ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Total Users
                  </Typography>
                  <Typography variant="h4">{metrics.totalUsers}</Typography>
                </CardContent>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Total Children
                  </Typography>
                  <Typography variant="h4">{metrics.totalChildren}</Typography>
                </CardContent>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    Average Quiz Score
                  </Typography>
                  <Typography variant="h4">{metrics.averageQuizScore}%</Typography>
                </CardContent>
              </DynamicCard>
            </Grid>
            {/* Add more metric cards as needed */}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">
            No metrics available.
          </Typography>
        )}

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="contained" color="primary" onClick={() => router.push("/admin/dashboard")}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>
    </>
    </AdminLayout>
  );
}
