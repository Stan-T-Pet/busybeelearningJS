import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from "@mui/material";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        setErrorMsg(result.error);
      } else {
        router.push("/dashboard"); // Adjust this route to where you want to redirect after login.
      }
    } catch (error) {
      setErrorMsg("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMsg}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
