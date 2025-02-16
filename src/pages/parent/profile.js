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
  const { data: session } = useSession();
  const router = useRouter();
  const [children, setChildren] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [childForm, setChildForm] = useState({ name: "", password: "", age: "" });

  useEffect(() => {
    if (!session) return;
    const fetchChildren = async () => {
      const response = await fetch(`/api/children/get?parentEmail=${session.user.email}`);
      if (!response.ok) return;
      const data = await response.json();
      setChildren(data.children || []);
    };
    fetchChildren();
  }, [session]);

  const handleOpenModal = (child = null) => {
    if (child) {
      setEditMode(true);
      setSelectedChild(child);
      setChildForm({ name: child.name, password: "", age: child.age });
    } else {
      setEditMode(false);
      setSelectedChild(null);
      setChildForm({ name: "", password: "", age: "" });
    }
    setModalOpen(true);
  };

  const handleChange = (e) =>
    setChildForm({ ...childForm, [e.target.name]: e.target.value });

  const handleSaveChild = async () => {
    const url = editMode ? `/api/children/update/${selectedChild._id}` : "/api/children/add";
    const method = editMode ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...childForm,
        parentEmail: session.user.email, // ✅ Assign parent's email
      }),
    });

    if (response.ok) {
      setModalOpen(false);
      router.reload();
    }
  };

  const handleDeleteChild = async (childId) => {
    const response = await fetch(`/api/children/delete/${childId}`, { method: "DELETE" });

    if (response.ok) {
      setChildren(children.filter((child) => child._id !== childId));
    }
  };

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        {/* Parent Details */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5">Parent Details</Typography>
            <Typography><b>Name:</b> {session?.user?.name}</Typography>
            <Typography><b>Email:</b> {session?.user?.email}</Typography>
          </CardContent>
        </Card>

        {/* Children List */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5">Your Children</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()} sx={{ mt: 2 }}>
              Add Child
            </Button>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {children.map((child) => (
                <Grid item xs={12} sm={6} md={4} key={child._id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{child.name}</Typography>
                      <Typography>Age: {child.age}</Typography>
                      <Typography>Parent Email: {session.user.email}</Typography> 
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
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Add/Edit Child Modal */}
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>{editMode ? "Edit Child" : "Add Child"}</DialogTitle>
          <DialogContent>
            <TextField name="name" label="Name" fullWidth value={childForm.name} onChange={handleChange} />
            <TextField name="password" label="Password" type="password" fullWidth value={childForm.password} onChange={handleChange} />
            <TextField name="age" label="Age" type="number" fullWidth value={childForm.age} onChange={handleChange} />
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
