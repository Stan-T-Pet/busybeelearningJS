import React, { useEffect } from "react";
import { Container, Typography, Button } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load
    if (!session || session.user.role !== "admin") {
      router.push("/login"); // Redirect unauthorized users
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return <Typography align="center">Loading...</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Welcome, {session.user.name}! You have **Admin** access.
      </Typography>
      <Button variant="contained" color="secondary" fullWidth onClick={() => signOut()}>
        Logout
      </Button>
    </Container>
  );
}
