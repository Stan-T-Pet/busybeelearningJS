import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AdminUsersUI = ({ initialUsers, initialRole, onRoleChange }) => {
  // Use the initial data passed from the page.
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  // For "child" users, we expect fullName, age, and parentEmail.
  // For parent/admin, we expect name and email.
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    parentEmail: "",
  });

  // Handle role selection change (UI only; data refetching is handled on the page level)
  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setSelectedRole(newRole);
    if (onRoleChange) {
      onRoleChange(newRole);
    }
  };

  // Open modal for Add (user === null) or Edit (user provided)
  const handleOpenModal = (user = null) => {
    if (user) {
      setEditMode(true);
      setCurrentUser(user);
      if (selectedRole === "child") {
        setFormData({
          name: user.fullName,
          email: user.loginEmail,
          password: "",
          age: user.age,
          parentEmail: user.parentEmail,
        });
      } else {
        setFormData({
          name: user.name,
          email: user.email,
          password: "",
          age: "",
          parentEmail: "",
        });
      }
    } else {
      setEditMode(false);
      setCurrentUser(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        age: "",
        parentEmail: "",
      });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleChangeForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save (Add or Update) user – here we call an API route.
  const handleSaveUser = async () => {
    try {
      const url = editMode
        ? `/api/admin/users/users?id=${currentUser.id}`
        : `/api/admin/users/users`;
      const method = editMode ? "PUT" : "POST";
      const payload = { ...formData, role: selectedRole };
      if (selectedRole !== "child") {
        delete payload.age;
        delete payload.parentEmail;
      }
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        handleCloseModal();
        // You may call a callback to refresh data from the parent page.
      } else {
        console.error("Error saving user", await res.text());
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Delete user
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`/api/admin/users/users?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // You may call a callback to refresh data from the parent page.
      } else {
        console.error("Error deleting user", await res.text());
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Define columns for the DataGrid.
  const columns = [
    { field: "id", headerName: "ID", width: 200 },
    {
      field: "name",
      headerName: selectedRole === "child" ? "Full Name" : "Name",
      width: 150,
    },
    {
      field: "email",
      headerName: selectedRole === "child" ? "Login Email" : "Email",
      width: 200,
    },
    { field: "role", headerName: "Role", width: 120 },
  ];
  if (selectedRole === "child") {
    columns.push({ field: "age", headerName: "Age", width: 100 });
  }
  columns.push({
    field: "actions",
    headerName: "Actions",
    width: 150,
    sortable: false,
    renderCell: (params) => (
      <>
        <IconButton onClick={() => handleOpenModal(params.row)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteUser(params.row.id)}>
          <DeleteIcon />
        </IconButton>
      </>
    ),
  });

  // Prepare rows for the DataGrid.
  const rows = users.map((user) => ({
    id: user._id,
    name: selectedRole === "child" ? user.fullName : user.name,
    email: selectedRole === "child" ? user.loginEmail : user.email,
    role: user.role,
    age: user.age || null,
  }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <FormControl sx={{ minWidth: 200, mb: { xs: 2, sm: 0 } }}>
          <InputLabel id="role-select-label">Select Role</InputLabel>
          <Select
            labelId="role-select-label"
            value={selectedRole}
            label="Select Role"
            onChange={handleRoleChange}
          >
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="parent">Parent</MenuItem>
            <MenuItem value="child">Child</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          onClick={() => handleOpenModal()}
          sx={{ mb: { xs: 2, sm: 0 } }}
        >
          Add New {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}
        </Button>
      </Box>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Box>

      {/* Modal for Add/Edit */}
      <Dialog open={modalOpen} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit User" : "Add New User"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label={selectedRole === "child" ? "Full Name" : "Name"}
              name="name"
              value={formData.name}
              onChange={handleChangeForm}
              fullWidth
            />
            {selectedRole !== "child" && (
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChangeForm}
                fullWidth
              />
            )}
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChangeForm}
              fullWidth
            />
            {selectedRole === "child" && (
              <>
                <TextField
                  label="Age"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChangeForm}
                  fullWidth
                />
                <TextField
                  label="Parent Email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleChangeForm}
                  fullWidth
                />
              </>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveUser}>
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsersUI;
