import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box, Alert } from "@mui/material";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters long.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        setSuccessMessage("Registration successful! Logging you in...");
        
        // Log the user in after registration
        const loginResult = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (loginResult?.error) {
          setErrorMessage("Registration successful, but login failed. Please log in manually.");
          setTimeout(() => router.push("/login"), 3000);
        } else {
          router.push("/dashboard");
        }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to register.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <form onSubmit={handleRegister}>
        <Box mb={2}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Email"
            type="email"
            variant="outlined"
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
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={isSubmitting}>
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
        <Box mt={2} textAlign="center">
          <Button variant="text" color="primary" onClick={() => router.push("/login")}>
            Already have an account? Login
          </Button>
        </Box>
      </form>
    </Container>
  );
}
