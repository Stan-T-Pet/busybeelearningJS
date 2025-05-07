import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  useTheme,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [metrics, setMetrics] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "admin") {
      fetch("/api/admin/metrics")
        .then((res) => res.json())
        .then((data) => setMetrics(data.metrics))
        .catch((err) => console.error("Error loading metrics:", err));
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
      <Box
        sx={{
          background: "linear-gradient(to bottom right, #001f3f, #0074D9)",
          minHeight: "100vh",
          pt: 6,
          pb: 6,
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h3" align="center" sx={{ fontWeight: "bold", color: "#fff", mb: 3 }}>
            Admin Dashboard
          </Typography>
          <Typography variant="h5" align="center" sx={{ color: "#ddd", mb: 5 }}>
            Welcome, {session.user.name}
          </Typography>

          {/* Navigation Grid */}
          <Grid container spacing={3} justifyContent="center">
            {[
              { label: "Profile", route: "/admin/profile", color: "primary" },
              { label: "Manage Users", route: "/admin/users", color: "secondary" },
              { label: "Metrics", route: "/admin/metrics", color: "info" },
              { label: "Courses", route: "/admin/courses", color: "success" },
              { label: "Lessons", route: "/admin/lessons", color: "warning" },
              { label: "Quizzes", route: "/admin/quizzes", color: "error" },
              { label: "DataLoader", route: "/admin/dataloader", color: "info" },
            ].map(({ label, route, color }) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={label}>
                <DynamicCard
                  title={label}
                  sx={{ cursor: "pointer", height: "100%" }}
                  onClick={() => router.push(route)}
                >
                  <Box textAlign="center">
                    <Button variant="contained" color={color} fullWidth>
                      {label}
                    </Button>
                  </Box>
                </DynamicCard>
              </Grid>
            ))}
          </Grid>

          {/* Metrics Section */}
          <Typography variant="h5" sx={{ mt: 6, mb: 3, color: "#fff", textAlign: "center" }}>
            Site Metrics
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {metrics ? (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <DynamicCard title="Total Users">
                    <Typography variant="h4" align="center">{metrics.totalUsers}</Typography>
                  </DynamicCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DynamicCard title="Total Parents">
                    <Typography variant="h4" align="center">{metrics.totalParents}</Typography>
                  </DynamicCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <DynamicCard title="Total Children">
                    <Typography variant="h4" align="center">{metrics.totalChildren}</Typography>
                  </DynamicCard>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Typography align="center" color="error">
                  Unable to load metrics.
                </Typography>
              </Grid>
            )}
          </Grid>

          {/* Logout */}
          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button variant="outlined" color="error" onClick={() => signOut()}>
              Logout
            </Button>
          </Box>
        </Container>
      </Box>
    </>
  );
}
