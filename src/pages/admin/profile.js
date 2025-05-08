// File: src/pages/admin/profile.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  Avatar,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import AdminLayout from "../../components/Layouts/AdminLayout";
export default function AdminProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [adminDetails, setAdminDetails] = useState(null);

  // Redirect if not authenticated or not an admin.
  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  // Fetch admin profile details from the backend.
  useEffect(() => {
    if (session) {
      async function fetchAdminProfile() {
        try {
          const res = await fetch(`/api/admin/profile?adminId=${session.user.id}`);
          if (!res.ok) {
            console.error("Failed to fetch admin profile");
            return;
          }
          const data = await res.json();
          setAdminDetails(data.admin);
        } catch (error) {
          console.error("Error fetching admin profile:", error);
        }
      }
      fetchAdminProfile();
    }
  }, [session]);

  if (status === "loading" || !adminDetails) {
    return (
      <Container maxWidth="sm" sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h5">Loading Profile...</Typography>
      </Container>
    );
  }

  return (
    <AdminLayout>
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, pb: 4 }}>
        <DynamicCard sx={{ boxShadow: 3, borderRadius: 2, p: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar
                sx={{ width: 80, height: 80, mr: 2 }}
                src={adminDetails.image || "/assets/images/avatar-placeholder.png"}
                alt={adminDetails.name}
              />
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  {adminDetails.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {adminDetails.email}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Welcome to your admin profile! Use the buttons below to manage users, review
              metrics, and control other administrative functions.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push("/admin/users")}
              >
                Manage Users
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => router.push("/admin/metrics")}
              >
                View Metrics
              </Button>
              {/* Add any additional admin navigation buttons here */}
            </Box>
          </CardContent>
        </DynamicCard>
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="outlined" color="error" onClick={() => signOut()}>
            Log Out
          </Button>
        </Box>
      </Container>
    </>
    </AdminLayout>
  );
}
