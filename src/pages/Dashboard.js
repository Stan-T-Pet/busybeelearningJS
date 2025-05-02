// File: src/pages/dashboard.js
import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import DynamicCard from "../components/DynamicCard";
import axios from "axios";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (status === "loading") return; // Still checking session, don't redirect yet

    if (!session) {
      // No session -> allow basic visitor view, but prevent access to protected parts
      return;
    }

    // If logged in but not a child, redirect based on role
    if (session.user.role && session.user.role !== "child") {
      router.replace("/"); // Redirect admins, parents, etc. to home
      return;
    }

    // Fetch available courses for child users
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/courses");
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [session, status, router]);

  // Visitor View (not logged in yet)
  if (!session && status !== "loading") {
    return (
      <>
        <Header />
        <Container sx={{ mt: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Welcome to Busy Bee Learning!
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary">
            Please <Button onClick={() => router.push("/login")}>Login</Button> or Explore Courses.
          </Typography>
        </Container>
      </>
    );
  }

  // Loading State
  if (status === "loading") {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          Loading...
        </Typography>
      </Container>
    );
  }

  // Logged-in Child View
  return (
    <>
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold" }}
      >
        Available Courses
      </Typography>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <DynamicCard title={course.title} sx={{ height: "100%" }}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() =>
                  router.push(
                    `/child/lessons?subject=${encodeURIComponent(course.title.toLowerCase())}`
                  )
                }
              >
                View Lessons
              </Button>
            </DynamicCard>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
