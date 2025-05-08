import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ParentLayout from "../../components/Layouts/ParentLayout";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";

export default function ParentProgress() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated" && session?.user?.email) {
      fetch(`/api/parents/progress?parentEmail=${session.user.email}`)
        .then((res) => res.json())
        .then((data) => {
          const formatted = (data.progress || []).map((child) => ({
            name: child.name || "Unnamed Child",
            lessonProgress: typeof child.lessonProgress === "number" ? child.lessonProgress : 0,
            quizProgress: typeof child.quizProgress === "number" ? child.quizProgress : 0,
          }));
          setProgressData(formatted);
        })
        .catch((err) => {
          console.error("Failed to fetch parent progress", err);
        })
        .finally(() => setLoading(false));
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading progress data...
        </Typography>
      </Container>
    );
  }

  return (
    <ParentLayout>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Children's Progress
        </Typography>

        {progressData.length === 0 ? (
          <Typography align="center" variant="body1">
            No progress records available.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {progressData.map((child) => (
              <Grid item xs={12} sm={6} key={child.name}>
                <DynamicCard>
                  <Typography variant="h6" gutterBottom>{child.name}</Typography>
                  <Typography variant="body2">
                    Lesson Progress: {child.lessonProgress}%
                  </Typography>
                  <Typography variant="body2">
                    Quiz Progress: {child.quizProgress}%
                  </Typography>
                </DynamicCard>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </ParentLayout>
  );
}