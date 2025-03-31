import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Parent or Child role added 07/03/2025
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password || !role) {
      setErrorMessage("Email, Password, and Role are required.");
      return;
    }

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      role,
    });
    if (res?.error) {
      setErrorMessage(res.error);
    } else {
      console.log("Login successful, redirecting...");

      // Redirect based on user role
      if (role === "parent") {
        router.push("/parent/dashboard");
      } else if (role === "child") {
        router.push("/child/dashboard");
      } else {
        router.push("/dashboard"); // Default fallback
      }
    }
  };

  return (
    <Container maxWidth="sm">
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
        <Box mb={2}>
          <FormControl fullWidth required>
            <InputLabel>Select Role</InputLabel>
            <Select value={role} onChange={(e) => setRole(e.target.value)}>
              <MenuItem value="parent">Parent</MenuItem>
              <MenuItem value="child">Child</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Box mt={2} textAlign="center">
        <Button variant="text" color="primary" onClick={() => router.push("/register")}>
          Don't have an account? Register
        </Button>
      </Box>
    </Container>
  );
}
