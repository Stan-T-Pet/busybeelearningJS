import React, { useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";

export default function ParentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Redirect if user is not a parent or not logged in
    if (status === "authenticated" && session?.user?.role !== "parent") {
      router.replace("/unauthorized"); // Redirect unauthorized users
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          Loading...
        </Typography>
      </Container>
    );
  }

  if (!session || session?.user?.role !== "parent") {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          You must be logged in as a **Parent** to access this page.
        </Typography>
        <Box mt={2} textAlign="center">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Parent Dashboard
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Welcome, {session.user.name}!
        </Typography>
      </Container>
    </>
  );
}