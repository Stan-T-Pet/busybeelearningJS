import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import Header from "@/components/Header";

export default function AdminMetricsPage() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch("/api/admin/metrics");
        const data = await res.json();
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch metrics:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <Container>
        <Header />
        <Typography sx={{ mt: 4 }}>
          <CircularProgress /> Loading metrics...
        </Typography>
      </Container>
    );
  }

  if (!metrics) {
    return (
      <Container>
        <Header />
        <Typography color="error" sx={{ mt: 4 }}>
          Failed to load metrics.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Metrics
        </Typography>
        <Grid container spacing={3}>
          {Object.entries(metrics).map(([label, value]) => (
            <Grid item xs={12} sm={6} key={label}>
              <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="subtitle1" color="text.secondary">
                  {label.replace(/([A-Z])/g, " $1")}
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
