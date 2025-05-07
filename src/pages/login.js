// File: src/pages/login.js
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Paper,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      router.push("/dashboard"); // Redirect to dashboard
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(rgb(25, 88, 107))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Login
          </Typography>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <form onSubmit={handleLogin}>
            <Box mb={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Box>
            <Box mb={2}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Box>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Login
            </Button>
          </form>
          <Box mt={2} textAlign="center">
            <Button
              variant="text"
              color="primary"
              onClick={() => router.push("/register")}
            >
              Don't have an account? Register
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}