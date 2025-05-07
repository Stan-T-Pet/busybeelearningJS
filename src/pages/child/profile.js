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
  Grid,
} from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";
import ChildLayout from "../../components/layouts/ChildLayout";


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
    <ChildLayout>
    <Box sx={{ background: "linear-gradient(135deg, rgb(61, 78, 61) rgb(14, 73, 122))", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {/* Account Header */}
        <Box sx={{ textAlign: "center", mb: 4, p: 2, borderRadius: 2, backgroundColor: "theme.primary", boxShadow: 5 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            Welcome, {session?.user?.name || "Guest"}!
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" fontSize="1.5rem">
            {session?.user?.email || "N/A"}
          </Typography>
        </Box>

        {/* Progress Sections */}
        <Grid container spacing={3}>
          {/* Lesson Progress Card */}
          <Grid item xs={12} md={6}>
            <DynamicCard
              title="Lesson Progress"
              sx={{ borderRadius: 2, boxShadow: 5 }}
            >
              
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
              
            </DynamicCard>
          </Grid>

          {/* Quiz Progress Card */}
          <Grid item xs={12} md={6}>
            <DynamicCard
              title="Quiz Progress"
              sx={{ borderRadius: 2, boxShadow: 3 }}
            >
              
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
              
            </DynamicCard>
          </Grid>
        </Grid>

        {/* Log Out Button */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Button variant="contained" color="secondary" onClick={() => open("dashboard", "_self")}>
            Dashboard
          </Button>
        </Box>
      </Container>
    </Box>
    </ChildLayout>
  );
}
