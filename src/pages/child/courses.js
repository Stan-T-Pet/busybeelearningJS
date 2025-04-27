// File: src/pages/child/courses.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from "@mui/material";
import Header from "../../components/Header";
import { useRouter } from "next/router";

export default function ChildCoursesPage() {
  const [courses, setCourses] = useState([]);
  const router = useRouter();

  useEffect(() => {
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
    <>
      <Header />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Available Courses
        </Typography>

        {courses.length === 0 ? (
          <Typography align="center">No courses available.</Typography>
        ) : (
          <Grid container spacing={3}>
            {courses.map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description || "No description provided."}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewCourse(course._id)}
                    >
                      <Typography variant="body2">View Course</Typography>
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
}
