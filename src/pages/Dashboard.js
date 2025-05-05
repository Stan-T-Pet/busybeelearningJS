import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
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
    if (status === "loading") return;

    if (!session) return;

    if (session.user.role !== "child") {
      router.replace("/");
      return;
    }

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

  // Visitor View
  if (!session && status !== "loading") {
    return (
      <>
        <Header />
        <Box
          sx={{
            background: "linear-gradient(to bottom, #fffefc, #f5f7fa)",
            minHeight: "100vh",
            py: 6,
          }}
        >
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
              Welcome to Busy Bee Learning!
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Please <Button onClick={() => router.push("/login")}>Login</Button> to access your lessons.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push("/explore")}
            >
              Explore Available Courses
            </Button>
          </Container>
        </Box>
      </>
    );
  }

  // Loading State
  if (status === "loading") {
    return (
      <>
        <Header />
        <Container maxWidth="sm" sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading your dashboard...
          </Typography>
        </Container>
      </>
    );
  }

  // Child View
  return (
    <>
      <Header />
      <Box
        sx={{
          background: "linear-gradient(to right, #e0f7fa, #e3f2fd)",
          minHeight: "100vh",
          py: 6,
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: "bold", mb: 4 }}
          >
            Your Courses
          </Typography>

          {courses.length === 0 ? (
            <Typography align="center" color="text.secondary">
              No courses available at the moment.
            </Typography>
          ) : (
            <Grid container spacing={3} justifyContent="center">
              {courses.map((course) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                  <DynamicCard
                    title={course.title}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  >
                    <Box textAlign="center" mt="auto">
                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={() =>
                          router.push(
                            `/child/lessons?subject=${encodeURIComponent(
                              course.title.toLowerCase()
                            )}`
                          )
                        }
                      >
                        View Lessons
                      </Button>
                    </Box>
                  </DynamicCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}