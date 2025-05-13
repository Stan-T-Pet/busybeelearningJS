// File: src/pages/admin/profile.js

import React from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  Grid,
  Divider,
} from "@mui/material";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";

export default function AdminProfile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Container>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!session || session.user.role !== "admin") {
    return (
      <Container>
        <Typography>You are not authorized to view this page.</Typography>
      </Container>
    );
  }

  const user = session.user;

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  sx={{ width: 120, height: 120, fontSize: 40 }}
                  alt={user.name}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </Grid>

            <Grid item xs={12} sm={8}>
              <Typography variant="h5" fontWeight="bold">
                {user.name || "Admin User"}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Role: <strong>{user.role}</strong>
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              Admin Tools (Coming Soon)
            </Typography>
            <Typography color="text.secondary">
              This section will include admin shortcuts, system stats, and quick links.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
}
