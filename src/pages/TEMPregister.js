import React, { useState } from "react";
import { 
  Container, TextField, Button, Typography, 
  Select, MenuItem, Box, Alert 
} from "@mui/material";
import { useRouter } from "next/router";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "parent",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("All fields are required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login");
      } else {
        setErrorMessage(data.error || "Failed to register.");
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

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

      <form onSubmit={handleRegister}>
        <Box mb={2}>
          <TextField 
            name="name"
            label="Name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange}
          />
        </Box>

        <Box mb={2}>
          <TextField 
            name="email"
            label="Email"
            type="email"
            fullWidth
            required
            value={formData.email}
            onChange={handleChange}
          />
        </Box>

        <Box mb={2}>
          <TextField 
            name="password"
            label="Password"
            type="password"
            fullWidth
            required
            value={formData.password}
            onChange={handleChange}
          />
        </Box>

        <Box mb={2}>
          <Select 
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="parent">Parent</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </Box>

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register"}
        </Button>
      </form>

      <Box mt={2} textAlign="center">
        <Button variant="text" color="primary" onClick={() => router.push("/login")}>
          Already have an account? Login
        </Button>
      </Box>
    </Container>
  );
}
