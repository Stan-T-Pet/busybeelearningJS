import React, { useState } from "react";
import { Container, TextField, Button, Typography, Select, MenuItem, Box } from "@mui/material";
import { useRouter } from "next/router";

export default function Register() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "parent" });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("All fields are required.");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Failed to register.");
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" align="center">Register</Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>}
      <form onSubmit={handleRegister}>
        <TextField name="name" label="Name" fullWidth onChange={handleChange} />
        <TextField name="email" label="Email" fullWidth onChange={handleChange} />
        <TextField name="password" label="Password" type="password" fullWidth onChange={handleChange} />
        <Select name="role" value={formData.role} onChange={handleChange} fullWidth>
          <MenuItem value="parent">Parent</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        <Button type="submit" fullWidth>Register</Button>
      </form>
    </Container>
  );
}
