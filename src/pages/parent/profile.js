import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";

export default function ParentProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  // Using fullName to match the Child model.
  const [childForm, setChildForm] = useState({ fullName: "", password: "", age: "" });

  // ✅ Redirect unauthorized users
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "parent") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  // ✅ Fetch children for logged-in parent
  useEffect(() => {
    // Only fetch if session is available.
    if (!session || !session.user) return;
    const fetchChildren = async () => {
      try {
        const response = await fetch(`/api/children/get?parentEmail=${session.user.email}`);
        if (!response.ok) {
          console.error("Failed to fetch children");
          return;
        }
        const data = await response.json();
        setChildren(data.children || []);
      } catch (err) {
        console.error("Error fetching children:", err);
      }
    };
    fetchChildren();
  }, [session]);

  // ✅ Open modal for adding/editing
  const handleOpenModal = (child = null) => {
    if (child) {
      setEditMode(true);
      setSelectedChild(child);
      // Set form values from the child.
      setChildForm({ fullName: child.fullName, password: "", age: child.age });
    } else {
      setEditMode(false);
      setSelectedChild(null);
      setChildForm({ fullName: "", password: "", age: "" });
    }
    setModalOpen(true);
  };

  const handleChange = (e) => setChildForm({ ...childForm, [e.target.name]: e.target.value });

  // ✅ Save new child or update existing
  const handleSaveChild = async () => {
    const url = editMode ? `/api/children/update/${selectedChild._id}` : "/api/children/add";
    const method = editMode ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: childForm.fullName,
          password: childForm.password,
          age: childForm.age,
          parentEmail: session.user.email,
        }),
      });
      if (response.ok) {
        setModalOpen(false);
        router.reload();
      } else {
        console.error("Failed to save child", await response.text());
      }
    } catch (error) {
      console.error("Error saving child:", error);
    }
  };

  // ✅ Delete child
  const handleDeleteChild = async (childId) => {
    try {
      const response = await fetch(`/api/children/delete/${childId}`, { method: "DELETE" });
      if (response.ok) {
        setChildren(children.filter((child) => child._id !== childId));
      } else {
        console.error("Failed to delete child", await response.text());
      }
    } catch (error) {
      console.error("Error deleting child:", error);
    }
  };

  if (!session || session.user.role !== "parent") {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          You must be logged in as a Parent to access this page.
        </Typography>
        <Box mt={2} textAlign="center">
          <Button variant="contained" color="primary" onClick={() => router.push("/login")}>
            Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Parent Details */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5">Parent Details</Typography>
            <Typography>
              <b>Name:</b> {session.user.name}
            </Typography>
            <Typography>
              <b>Email:</b> {session.user.email}
            </Typography>
          </CardContent>
        </Card>

        {/* Children List with personal details */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5">Your Children</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              sx={{ mt: 2 }}
            >
              Add Child
            </Button>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {children.length > 0 ? (
                children.map((child) => (
                  <Grid item xs={12} sm={6} md={4} key={child._id}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">{child.fullName}</Typography>
                        <Typography>Age: {child.age}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Email: {child.loginEmail}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <IconButton color="primary" onClick={() => handleOpenModal(child)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleDeleteChild(child._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="body1" align="center">
                  No children found.
                </Typography>
              )}
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Button variant="contained" color="secondary" onClick={() => router.push("/dashboard")}>
            Back to Dashboard
          </Button>
        </Box>
      </Container>

      {/* Add/Edit Child Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit Child" : "Add Child"}</DialogTitle>
        <DialogContent>
          <TextField
            name="fullName"
            label="Full Name"
            fullWidth
            value={childForm.fullName}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            fullWidth
            value={childForm.password}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            name="age"
            label="Age"
            type="number"
            fullWidth
            value={childForm.age}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveChild}>
            {editMode ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}