// File: src/pages/child/profile.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Box,
  LinearProgress,
  AppBar,
  Toolbar,
  Divider,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";

export default function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Local state for progress data from lessons and quizzes.
  const [progress, setProgress] = useState({ lessons: [], quizzes: [] });
  const [loading, setLoading] = useState(true);

  // Redirect to login if not authenticated.
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch progress data from the backend.
  useEffect(() => {
    if (!session || !session.user) return;

    const fetchProgress = async () => {
      try {
        // Make sure your API endpoint returns an object with `lessons` and `quizzes` arrays.
        const res = await fetch(
          `/api/progress/getChildProgress?childId=${session.user.id}`
        );
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
    <Box sx={{ background: "linear-gradient(to bottom, #fdfbfb, #ebedee)", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Account Header */}
        <Box sx={{ textAlign: "center", mb: 4, p: 2, borderRadius: 2, backgroundColor: "#fff", boxShadow: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Welcome, {session?.user?.name || "Guest"}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {session?.user?.email || "N/A"}
          </Typography>
        </Box>

        {/* Progress Sections */}
        <Grid container spacing={3}>
          {/* Lesson Progress Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#1976d2" }}>
                  Lesson Progress
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {progress.lessons.length > 0 ? (
                  progress.lessons.map((lesson, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {lesson.title}
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
                  ))
                ) : (
                  <Typography variant="body2" align="center" color="text.secondary">
                    No lesson progress available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Quiz Progress Card */}
          <Grid item xs={12} md={6}>
            <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold", color: "#d32f2f" }}>
                  Quiz Progress
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {progress.quizzes.length > 0 ? (
                  progress.quizzes.map((quiz, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                        {quiz.title} — Score: {quiz.score || "N/A"}
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          quiz.totalScore
                            ? (quiz.score / quiz.totalScore) * 100
                            : 0
                        }
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
                  ))
                ) : (
                  <Typography variant="body2" align="center" color="text.secondary">
                    No quiz progress available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Log Out Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="contained" color="secondary" onClick={() => open("/dashboard", "_self")}>
            Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
