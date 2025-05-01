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
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import Link from "next/link";
import Header from "../../../components/Header";

export default function CourseLessonsPage({ initialLessons, course }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { courseId } = router.query;

  const [lessons, setLessons] = useState(initialLessons || []);
  const [progressMap, setProgressMap] = useState({});

  useEffect(() => {
    if (!session?.user?.id || !courseId) return;

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`/api/lessons/progress?childId=${session.user.id}`);
        const progressData = res.data.progress || [];
        const completedLessons = progressData
          .filter(
            (entry) =>
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

  return (
    <Box sx={{ background: "#f9f9f9", minHeight: "100vh" }}>
      <Header />
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          {course?.title || "Course Lessons"}
        </Typography>

        <Typography variant="subtitle1" align="center" gutterBottom>
          {course?.description}
        </Typography>

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
                    <Link href={`/child/lessons/${lesson._id}`} passHref>
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

        <Box mt={4} display="flex" justifyContent="center">
          <Link href={`/child/quiz?courseId=${courseId}`} passHref>
            <Button variant="outlined">Go to Course Quizzes</Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}

export async function getServerSideProps(context) {
  const { courseId } = context.query;
  const connectDB = (await import("../../../server/config/database")).default;
  const Course = (await import("../../../server/models/Course")).default;
  const Lesson = (await import("../../../server/models/Lesson")).default;

  try {
    await connectDB();

    const course = await Course.findById(courseId).lean();
    const lessons = await Lesson.find({ courseId }).lean();

    const lessonsJSON = lessons.map((lesson) => JSON.parse(JSON.stringify(lesson)));
    const courseJSON = course ? JSON.parse(JSON.stringify(course)) : null;

    return {
      props: {
        initialLessons: lessonsJSON,
        course: courseJSON,
      },
    };
  } catch (error) {
    console.error("Error loading course lessons:", error);
    return {
      props: { initialLessons: [], course: null },
    };
  }
}
