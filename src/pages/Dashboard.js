import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function Dashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          You must be logged in to access this page.
        </Typography>
        <Button variant="contained" color="primary" fullWidth onClick={() => router.push("/login")}>
          Go to Login
        </Button>
        <Button variant="contained" color="secondary" fullWidth style={{ marginTop: "10px" }} onClick={() => router.push("/register")}>
          Register
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" align="center" paragraph>
        Welcome, {session.user.name}!
      </Typography>
      <Button variant="contained" color="secondary" fullWidth onClick={() => signOut()}>
        Logout
      </Button>
    </Container>
  );
}
