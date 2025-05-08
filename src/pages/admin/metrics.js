// File: src/pages/admin/metrics.js

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import AdminLayout from "@/components/Layouts/AdminLayout";
import DynamicCard from "@/components/DynamicCard";

export default function AdminMetrics() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        const data = await res.json();
        setMetrics(data?.metrics || {});
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
        setMetrics({});
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.role === "admin") fetchMetrics();
  }, [session]);

  if (status === "loading" || loading || !metrics || Object.keys(metrics).length === 0) {
    return (
      <AdminLayout>
        <Header />
        <Container sx={{ mt: 4, textAlign: "center" }}>
          <CircularProgress />
          <Typography variant="h6">Loading metrics...</Typography>
        </Container>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Header />
      <Box
        sx={{
          background: "linear-gradient(to bottom right, #001f3f, #0074D9)",
          minHeight: "100vh",
          pt: 6,
          pb: 6,
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: "bold", color: "#fff", mb: 4 }}
          >
            Platform Metrics
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Total Users">
                <Typography variant="h4" align="center">
                  {metrics.totalUsers ?? 0}
                </Typography>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Total Parents">
                <Typography variant="h4" align="center">
                  {metrics.totalParents ?? 0}
                </Typography>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Total Children">
                <Typography variant="h4" align="center">
                  {metrics.totalChildren ?? 0}
                </Typography>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Courses">
                <Typography variant="h4" align="center">
                  {metrics.totalCourses ?? 0}
                </Typography>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Lessons">
                <Typography variant="h4" align="center">
                  {metrics.totalLessons ?? 0}
                </Typography>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Quizzes">
                <Typography variant="h4" align="center">
                  {metrics.totalQuizzes ?? 0}
                </Typography>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Enrolled Children">
                <Typography variant="h4" align="center">
                  {metrics.totalEnrolled ?? 0}
                </Typography>
              </DynamicCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DynamicCard title="Total Activity Logs">
                <Typography variant="h4" align="center">
                  {metrics.totalActivityLogs ?? 0}
                </Typography>
              </DynamicCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </AdminLayout>
  );
}