import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Container, Typography, Grid, Button } from "@mui/material";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";
import ChildLayout from "../../components/Layouts/ChildLayout";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export default function ChildCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set());
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchCoursesAndEnrollments = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          axios.get("/api/courses"),
          axios.get("/api/enrollments")
        ]);

        if (Array.isArray(coursesRes.data.courses)) {
          setCourses(coursesRes.data.courses);
        }

        if (Array.isArray(enrollmentsRes.data.enrollments)) {
          const ids = new Set(enrollmentsRes.data.enrollments.map((e) => e.courseId));
          setEnrolledCourseIds(ids);
        }
      } catch (err) {
        console.error("Error loading courses or enrollments:", err);
      }
    };

    fetchCoursesAndEnrollments();
  }, []);

  const handleViewCourse = (courseId) => {
    router.push(`/child/courses/${courseId}`);
  };

  const handleToggleEnrollment = async (courseId) => {
    const isEnrolled = enrolledCourseIds.has(courseId);
    try {
      if (isEnrolled) {
        await axios.delete(`/api/enrollments?courseId=${courseId}`);
        setEnrolledCourseIds((prev) => {
          const updated = new Set(prev);
          updated.delete(courseId);
          return updated;
        });
      } else {
        await axios.post("/api/enrollments", { courseId });
        setEnrolledCourseIds((prev) => new Set(prev).add(courseId));
      }
    } catch (err) {
      console.error("Enrollment toggle failed:", err);
      alert("Failed to update enrollment. See console.");
    }
  };

  return (
    <ChildLayout>
      <Box sx={{ background: "linear-gradient(135deg, rgb(118, 215, 228), rgb(40, 94, 8) 50%)", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: "bold" }}>
            Available Courses
          </Typography>

          {courses.length === 0 ? (
            <Typography align="center">No courses available.</Typography>
          ) : (
            <Grid container spacing={3}>
              {courses.map((course) => {
                const isEnrolled = enrolledCourseIds.has(course._id);
                return (
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
                        sx={{ mb: 1 }}
                      >
                        View Course
                      </Button>
                      <Button
                        variant="contained"
                        color={isEnrolled ? "warning" : "success"}
                        size="small"
                        onClick={() => handleToggleEnrollment(course._id)}
                        fullWidth
                      >
                        {isEnrolled ? "Enrolled (Click to Leave)" : "Enroll"}
                      </Button>
                    </DynamicCard>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Container>
      </Box>
    </ChildLayout>
  );
}