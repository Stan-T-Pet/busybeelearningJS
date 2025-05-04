import React, { useEffect, useState } from "react";
import {Box,Container,Grid,Typography, Button} from "@mui/material";
import Link from "next/link";
import DynamicCard from "@/components/DynamicCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import playSound from "@/components/SoundManager";

export default function ChildDashboard() {
  const [lessons, setLessons] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivities() {
      try {
        const lessonsRes = await fetch("/api/lessons/Lesson");
        const quizzesRes = await fetch("/api/quizzes/get");

        if (!lessonsRes.ok || !quizzesRes.ok) {
          console.error("Failed to fetch lessons or quizzes");
          return;
        }

        const lessonsData = await lessonsRes.json();
        const quizzesData = await quizzesRes.json();

        setLessons((lessonsData.lessons || []).sort(() => Math.random() - 0.5));
        setQuizzes((quizzesData.quizzes || []).sort(() => Math.random() - 0.5));
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  return (
    <Box
      sx={{
        background: (theme) =>
          theme.palette.mode === "dark"
            ? "linear-gradient(to bottom, #0f172a, #1e293b)"
            : "linear-gradient(to bottom, #fdfbfb, #ebedee)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Header />

      <Container maxWidth="lg" sx={{ mt: 4, pb: 6, flexGrow: 1 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          Hey there, ready to learn?
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" gutterBottom>
          Choose a lesson or quiz below to get started!
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h6">Loading activities...</Typography>
          </Box>
        ) : (
          <>
            {/* Lessons Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Lessons
              </Typography>
              {lessons.length > 0 ? (
                <Grid container spacing={3}>
                  {lessons.map((lesson) => (
                    <Grid item xs={12} sm={6} md={4} key={lesson._id}>
                      <Link href={`/child/lessons/${lesson._id}`} passHref legacyBehavior>
                        <DynamicCard
                          title={lesson.title}
                          sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          {lesson.description && (
                            <Typography variant="body2" align="center" sx={{ color: "text.secondary", mb: 2 }}>
                              {lesson.description}
                            </Typography>
                          )}
                          <Box sx={{ textAlign: "center" }}>
                            <Button onClick={() => {playSound("select");}} variant="contained" color="primary">
                              Start Lesson
                            </Button>
                          </Box>
                        </DynamicCard>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" align="center">
                  No lessons available.
                </Typography>
              )}
            </Box>

            {/* Quizzes Section */}
            <Box sx={{ mt: 6 }}>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
                Quizzes
              </Typography>
              {quizzes.length > 0 ? (
                <Grid container spacing={3}>
                  {quizzes.map((quiz) => (
                    <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                      <Link href={`/child/quiz/${quiz._id}`} passHref legacyBehavior>
                        <DynamicCard
                          title={quiz.title || quiz.questionText || "Untitled Quiz"}
                          sx={{
                            borderRadius: 2,
                            boxShadow: 3,
                            cursor: "pointer",
                            transition: "transform 0.2s, box-shadow 0.2s",
                            "&:hover": {
                              transform: "scale(1.02)",
                              boxShadow: 6,
                            },
                          }}
                        >
                          <Box sx={{ textAlign: "center" }}>
                            <Button variant="contained" color="primary">
                              Take Quiz
                            </Button>
                          </Box>
                        </DynamicCard>
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body1" align="center">
                  No quizzes available.
                </Typography>
              )}
            </Box>

            {/* Progress Button */}
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Link href="/child/profile" passHref legacyBehavior>
                <Button variant="outlined" color="primary">
                  View Progress
                </Button>
              </Link>
            </Box>
          </>
        )}
      </Container>

      <Footer />
    </Box>
  );
}
