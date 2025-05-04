import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import Header from "@/components/Header";
import { useSession } from "next-auth/react";

export default function EditUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [form, setForm] = useState({ name: "", email: "", role: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user.role !== "admin") {
      router.replace("/unauthorized");
    }
  }, [session, status]);

  useEffect(() => {
    if (!id) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/admin/${id}`);
        const data = await res.json();

        if (!res.ok || !data.user) {
          throw new Error(data.error || "User not found");
        }

        setForm({
          name: data.user.name || "",
          email: data.user.email || "",
          role: data.user.role || "",
          password: "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update user");
      router.push("/admin/users");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <Container>
        <Header />
        <Typography sx={{ mt: 4 }}>
          <CircularProgress size={24} /> Loading...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Header />
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>Edit User</Typography>

        <TextField
          fullWidth
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          margin="normal"
          helperText="Leave blank to keep current password"
        />
        <TextField
          fullWidth
          select
          label="Role"
          name="role"
          value={form.role}
          onChange={handleChange}
          margin="normal"
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="parent">Parent</MenuItem>
          <MenuItem value="child">Child</MenuItem>
        </TextField>

        <Box sx={{ mt: 3, textAlign: "right" }}>
          <Button variant="contained" onClick={handleUpdate}>
            Update User
          </Button>
        </Box>
      </Container>
    </>
  );
}
