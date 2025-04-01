// File: src/pages/dashboard.js
import React, { useEffect } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../components/Header";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; //Wait for session to load.
    if (!session) return; // Optionally, you could redirect to login here.

    const role = session.user.role;
    //Redirect based on the user's role.
    if (role === "admin") {
      router.replace("/admin/dashboard");
    } else if (role === "parent") {
      router.replace("/parent/dashboard");
    } else if (role === "child") {
      router.replace("/child/dashboard");
    } else {
      console.error("Unknown role:", role);
    }
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          Loading...
        </Typography>
      </Container>
    );
  }

  //Fallback (should not normally be reached because of the redirect).
  return (
    <>
      <Header />
      <Container maxWidth="sm">
        <Typography variant="h4" align="center" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" align="center" paragraph>
          Welcome, {session.user.name}!
        </Typography>
      </Container>
    </>
  );
}
