// File: src/pages/child/courses.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Typography, Grid, Button} from "@mui/material";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";
import { useRouter } from "next/router";

export default function ChildCoursesPage() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
    // Fetch all available courses from API
    const fetchCourses = async () => {
      try {
        const res = await axios.get("/api/courses");
        if (res.data && Array.isArray(res.data.courses)) {
          setCourses(res.data.courses);
        } else {
          console.error("Unexpected response:", res.data);
          setCourses([]);
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
        setCourses([]);
      }
    };
    fetchCourses();
  }, []);

  const handleViewCourse = (courseId) => {
    router.push(`/child/courses/${courseId}`);
  };

  return (
    <Box sx={{ background: "linear-gradient(to bottom, #fdfbfb, #ebedee)", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
          Available Courses
        </Typography>

        {courses.length === 0 ? (
          <Typography align="center">No courses available.</Typography>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <DynamicCard title={course.title}>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {course.description || "No description provided."}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleViewCourse(course._id)}
                    fullWidth
                  >
                    View Course
                  </Button>
                </DynamicCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}