// File: src/pages/child/courses/[courseId].js

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Container,
  Grid,
  CardContent,
  CardActions,
} from "@mui/material";
import Link from "next/link";
import Header from "../../../components/Header";
import DynamicCard from "../../../components/DynamicCard";
import ChildLayout from "../../../components/Layouts/ChildLayout";

export default function CourseLessonsPage({ initialLessons, course }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { courseId } = router.query;

  const [lessons, setLessons] = useState(initialLessons || []);
  const [progressMap, setProgressMap] = useState({});
  const [enrolled, setEnrolled] = useState(false);
  const [loadingEnroll, setLoadingEnroll] = useState(true);

  // Fetch child progress
  useEffect(() => {
    if (!session?.user?.id || !courseId) return;

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`/api/lessons/progress?childId=${session.user.id}`);
        const progressData = res.data.progress || [];

        const completedLessons = progressData
          .filter((entry) =>
            entry.contentType === "lesson" &&
            entry.completed === true &&
            entry.courseId === courseId
          )
          .reduce((acc, curr) => {
            acc[curr.contentId] = true;
            return acc;
          }, {});
        setProgressMap(completedLessons);
      } catch (err) {
        console.error("Error loading progress:", err);
      }
    };

    fetchProgress();
  }, [session?.user?.id, courseId]);

  // Check if enrolled in course
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!session?.user?.id || !courseId) return;

      try {
        const res = await axios.get("/api/enrollments");
        const enrollments = res.data.enrollments || [];
        const isEnrolled = enrollments.some(
          (entry) => String(entry.courseId) === String(courseId)
        );
        setEnrolled(isEnrolled);
      } catch (err) {
        console.error("Failed to check enrollment:", err);
      } finally {
        setLoadingEnroll(false);
      }
    };

    checkEnrollment();
  }, [session?.user?.id, courseId]);

  const handleEnroll = async () => {
    try {
      await axios.post("/api/enrollments", { courseId });
      setEnrolled(true);
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  return (
    <ChildLayout>
      <Box sx={{ background: "theme.primary", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h4">
              {course?.title || "Course Lessons"}
            </Typography>

            {!loadingEnroll && (
              <Button
                variant={enrolled ? "outlined" : "contained"}
                color={enrolled ? "success" : "primary"}
                disabled={enrolled}
                onClick={handleEnroll}
              >
                {enrolled ? "Enrolled" : "Enroll"}
              </Button>
            )}
          </Box>

          <Typography variant="subtitle1" align="left" gutterBottom>
            {course?.description}
          </Typography>

          {!enrolled ? (
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>
              Please enroll in this course to view its lessons and quizzes.
            </Typography>
          ) : (
            <>
              {/* Lessons Grid */}
              <Grid container spacing={3}>
                {lessons.map((lesson) => {
                  const isCompleted = progressMap[lesson._id];

                  return (
                    <Grid item xs={12} sm={6} md={4} key={lesson._id}>
                      <DynamicCard sx={{ height: "100%" }}>
                        <CardContent>
                          <Typography variant="h6">{lesson.title}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {lesson.description}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ justifyContent: "space-between" }}>
                          <Link href={`/child/lessons/${lesson._id}`} passHref legacyBehavior>
                            <Button variant="contained" color={isCompleted ? "success" : "primary"}>
                              {isCompleted ? "Completed" : "Start Lesson"}
                            </Button>
                          </Link>
                        </CardActions>
                      </DynamicCard>
                    </Grid>
                  );
                })}
              </Grid>

              {/* Navigation to Quizzes */}
              <Box mt={4} display="flex" justifyContent="center">
                <Link href={`/child/quiz?courseId=${courseId}`} passHref legacyBehavior>
                  <Button variant="outlined">Go to Course Quizzes</Button>
                </Link>
              </Box>
            </>
          )}
        </Container>
      </Box>
    </ChildLayout>
  );
}

// Server-side props
export async function getServerSideProps(context) {
  const { courseId } = context.query;
  const connectDB = (await import("../../../server/config/database")).default;
  const Course = (await import("../../../server/models/Course")).default;
  const Lesson = (await import("../../../server/models/Lesson")).default;

  try {
    await connectDB();

    const course = await Course.findById(courseId).lean();
    const lessons = await Lesson.find({ courseId }).lean();

    return {
      props: {
        initialLessons: lessons.map((lesson) => JSON.parse(JSON.stringify(lesson))),
        course: course ? JSON.parse(JSON.stringify(course)) : null,
      },
    };
  } catch (error) {
    console.error("Error loading course lessons:", error);
    return {
      props: { initialLessons: [], course: null },
    };
  }
}