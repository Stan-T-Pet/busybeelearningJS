// File: src/pages/child/profile.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  LinearProgress,
  CircularProgress,
  Grid,
  Divider,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";
import ChildLayout from "../../components/Layouts/ChildLayout";

// Grouping helper: group items by courseId
function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || "unknown";
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {});
}

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [progress, setProgress] = useState({ lessons: [], quizzes: [] });
  const [loading, setLoading] = useState(true);

  // Toggle visibility per courseId
  const [lessonToggles, setLessonToggles] = useState({});
  const [quizToggles, setQuizToggles] = useState({});

  const toggleLessonSection = (courseId) => {
    setLessonToggles((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  const toggleQuizSection = (courseId) => {
    setQuizToggles((prev) => ({ ...prev, [courseId]: !prev[courseId] }));
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!session?.user) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(`/api/progress/getChildProgress?childId=${session.user.id}`);
        if (!res.ok) {
          console.error("Failed to fetch progress");
          return;
        }

        const data = await res.json();
        setProgress({
          lessons: data.lessons || [],
          quizzes: data.quizzes || [],
        });
      } catch (error) {
        console.error("Error fetching progress:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <ChildLayout>
      <Box sx={{ background: "linear-gradient(135deg, rgb(61, 78, 61), rgb(14, 73, 122))", minHeight: "100vh" }}>
        <Header />
        <Container sx={{ mt: 4, mb: 6 }}>
          <Box sx={{ textAlign: "center", mb: 4, p: 2, borderRadius: 2, backgroundColor: "theme.primary", boxShadow: 5 }}>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Welcome, {session?.user?.name || "Guest"}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" fontSize="1.5rem">
              {session?.user?.email || "N/A"}
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Lessons */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>Lesson Progress</Typography>
              {Object.entries(groupBy(progress.lessons, "courseId")).map(([courseId, lessons], idx) => {
                const courseTitle = lessons[0]?.courseTitle || `Course ${idx + 1}`;
                const isOpen = lessonToggles[courseId] || false;

                return (
                  <DynamicCard
                    key={courseId}
                    title={courseTitle}
                    sx={{ borderRadius: 2, boxShadow: 4, mb: 3 }}
                  >
                    <Button onClick={() => toggleLessonSection(courseId)} sx={{ mb: 2 }}>
                      {isOpen ? "Hide Lessons" : "Show Lessons"}
                    </Button>
                    {isOpen && (
                      <>
                        <Divider sx={{ mb: 2 }} />
                        {lessons.map((lesson, index) => (
                          <Box key={index} sx={{ mb: 3 }}>
                            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                              {lesson.title}
                              {lesson.progress === 100 && (
                                <Typography
                                  variant="caption"
                                  sx={{ ml: 1, color: "green", fontWeight: "bold" }}
                                >
                                  ✓ Completed
                                </Typography>
                              )}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {lesson.completedAt
                                ? `Completed on ${new Date(lesson.completedAt).toLocaleDateString()}`
                                : "Not yet completed"}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={lesson.progress}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#e0f7fa",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#00acc1",
                                },
                              }}
                            />
                          </Box>
                        ))}
                      </>
                    )}
                  </DynamicCard>
                );
              })}
            </Grid>

            {/* Quizzes */}
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>Quiz Progress</Typography>
              {Object.entries(groupBy(progress.quizzes, "courseId")).map(([courseId, quizzes], idx) => {
                const courseTitle = quizzes[0]?.courseTitle || `Course ${idx + 1}`;
                const isOpen = quizToggles[courseId] || false;

                return (
                  <DynamicCard
                    key={courseId}
                    title={courseTitle}
                    sx={{ borderRadius: 2, boxShadow: 4, mb: 3 }}
                  >
                    <Button onClick={() => toggleQuizSection(courseId)} sx={{ mb: 2 }}>
                      {isOpen ? "Hide Quizzes" : "Show Quizzes"}
                    </Button>
                    {isOpen && (
                      <>
                        <Divider sx={{ mb: 2 }} />
                        {quizzes.map((quiz, index) => (
                          <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                              {quiz.title} — Score: {quiz.score}/{quiz.totalScore}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(quiz.score / quiz.totalScore) * 100}
                              sx={{
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: "#ffebee",
                                "& .MuiLinearProgress-bar": {
                                  backgroundColor: "#c62828",
                                },
                              }}
                            />
                          </Box>
                        ))}
                      </>
                    )}
                  </DynamicCard>
                );
              })}
            </Grid>
          </Grid>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button variant="contained" color="secondary" onClick={() => router.push("/child/dashboard")}>
              Dashboard
            </Button>
          </Box>
        </Container>
      </Box>
    </ChildLayout>
  );
}