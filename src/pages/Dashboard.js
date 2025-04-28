// File: src/pages/dashboard.js
import React, { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import axios from "axios";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (status === "loading") return; // Wait for session

    if (!session) {
      router.replace("/login");
      return;
    }

    // Fetch available courses from the database
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/admin/courses");
        setCourses(res.data.courses || []);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <Container maxWidth="sm">
        <Typography variant="h5" align="center" mt={5}>
          Loading...
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Welcome, {session.user.name}!
        </Typography>

        {session.user.role === "child" && (
          <>
            <Typography variant="h5" align="center" gutterBottom>
              Available Courses
            </Typography>

            <Grid container spacing={3}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} key={course._id}>
                  <Card sx={{ boxShadow: 3 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {course.title}
                      </Typography>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() =>
                          router.push(`/child/lessons?subject=${encodeURIComponent(course.title.toLowerCase())}`)
                        }
                      >
                        View Lessons
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Container>
    </>
  );
}
