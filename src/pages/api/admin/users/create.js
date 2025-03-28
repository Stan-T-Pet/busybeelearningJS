// File: src/components/AdminUserForm.js
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from "@mui/material";

const AdminUserForm = ({ onUserCreated }) => {
  const [formData, setFormData] = useState({
    role: "admin",
    name: "",
    email: "",
    password: "",
    // Only for child users:
    age: "",
    parentEmail: "",
    // For admin users:
    permissions: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Prepare the payload – for non-child roles, remove extra fields.
    const payload = { ...formData };
    if (payload.role !== "child") {
      delete payload.age;
      delete payload.parentEmail;
    }
    // For admin, you might split permissions (if multiple) into an array.
    if (payload.role === "admin" && payload.permissions) {
      payload.permissions = payload.permissions.split(",").map((p) => p.trim());
    }

    try {
      const res = await fetch("/api/admin/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setSuccess("User created successfully!");
        setFormData({
          role: "admin",
          name: "",
          email: "",
          password: "",
          age: "",
          parentEmail: "",
          permissions: "",
        });
        if (onUserCreated) {
          onUserCreated(); // Callback to refresh the user list if needed.
        }
      } else {
        const errText = await res.text();
        setError(errText || "Error creating user.");
      }
    } catch (err) {
      console.error("Error saving user:", err);
      setError("Error saving user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, p: 2, border: "1px solid #ddd", borderRadius: 2 }}>
      <Typography variant="h5" align="center" gutterBottom>
        Create New User
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}
      <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="role-select-label">Role</InputLabel>
          <Select
            labelId="role-select-label"
            name="role"
            value={formData.role}
            label="Role"
            onChange={handleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="parent">Parent</MenuItem>
            <MenuItem value="child">Child</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label={formData.role === "child" ? "Full Name" : "Name"}
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        {formData.role !== "child" && (
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
        )}
        <TextField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          required
        />
        {formData.role === "child" && (
          <>
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Parent Email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              fullWidth
            />
          </>
        )}
        {formData.role === "admin" && (
          <TextField
            label="Permissions (comma separated)"
            name="permissions"
            value={formData.permissions}
            onChange={handleChange}
            fullWidth
          />
        )}
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </Box>
    </Container>
  );
};

export default AdminUserForm;
