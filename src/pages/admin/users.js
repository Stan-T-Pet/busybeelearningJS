//file: pages/admin/users.js

import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DynamicCard from "../../components/DynamicCard";
import Header from "../../components/Header";
import AdminLayout from "@/components/layouts/AdminLayout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


export default function AdminUsers() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status, router]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/admin/users");
        if (!res.ok) {
          console.error("Failed to fetch users");
          return;
        }
        const data = await res.json();
        setUsers(data.users || []);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session?.user?.role === "admin") {
      fetchUsers();
    }
  }, [session]);

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">Loading users...</Typography>
      </Container>
    );
  }

  return (
    <AdminLayout>
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, pb: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Manage Users
        </Typography>
        {users.length > 0 ? (
          <Grid container spacing={3}>
            {users.map((user) => (
              <Grid item xs={12} sm={6} md={4} key={user._id}>
                <DynamicCard sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Role: {user.role}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton
                      color="primary"
                      onClick={() => router.push(`/admin/users/edit/${user._id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        fetch(`/api/admin/users/${user._id}`, { method: "DELETE" })
                          .then((res) => {
                            if (res.ok) {
                              setUsers((prev) => prev.filter((u) => u._id !== user._id));
                            } else {
                              console.error("Failed to delete user");
                            }
                          })
                          .catch((error) => console.error("Error deleting user:", error));
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </DynamicCard>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" align="center">
            No users found.
          </Typography>
        )}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/admin/users/create")}
          >
            Create New User
          </Button>
        </Box>
      </Container>
    </>
    </AdminLayout>
  );
}
