import React, { useState, useEffect } from "react";
import { Container, Typography, Card, CardContent, Button, Box, Grid, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../../components/Header";
import ChildCard from "../../../components/ChildCard";
import AddIcon from "@mui/icons-material/Add";

export default function ParentProfile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  // Using fullName to match the Child model.
  const [childForm, setChildForm] = useState({ fullName: "", password: "", age: "" });

  useEffect(() => {
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

  const handleOpenModal = (child = null) => {
    if (child) {
      setEditMode(true);
      setSelectedChild(child);
      setChildForm({ fullName: child.fullName, password: "", age: child.age });
    } else {
      setEditMode(false);
      setSelectedChild(null);
      setChildForm({ fullName: "", password: "", age: "" });
    }
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setChildForm({ ...childForm, [e.target.name]: e.target.value });

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

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Parent Details */}
        <DynamicCard sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5">Parent Details</Typography>
            <Typography>
              <b>Name:</b> {session?.user?.name}
            </Typography>
            <Typography>
              <b>Email:</b> {session?.user?.email}
            </Typography>
          </CardContent>
        </DynamicCard>

        {/* Children List */}
        <DynamicCard sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5">Your Children</Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                Add Child
              </Button>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {children.map((child) => (
                <Grid item xs={12} sm={6} md={4} key={child._id}>
                  <ChildCard child={child} onEdit={handleOpenModal} onDelete={handleDeleteChild} />
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </DynamicCard>

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
      </Container>
    </>
  );
}
