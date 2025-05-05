// File: src/pages/admin/users/[id].js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Container, Typography, CircularProgress } from "@mui/material";
import Header from "@/components/Header";

export default function ViewUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/admin/users/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "User not found");
        setUser(data.user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (status === "loading" || loading) {
    return (
      <Container>
        <Header />
        <Typography sx={{ mt: 4 }}>
          <CircularProgress size={24} /> Loading user...
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

  if (!user) {
    return (
      <Container>
        <Header />
        <Typography sx={{ mt: 4 }}>
          No user data available.
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Header />
      <Typography variant="h5" sx={{ mt: 4 }}>
        Viewing User: {user.name}
      </Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Role: {user.role}</Typography>
    </Container>
  );
}
