import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Header from "../../components/Header";
import DynamicCard from "../../components/DynamicCard";

export default function ParentProgress() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && status === "authenticated") {
      const fetchProgress = async () => {
        try {
          console.log("Fetching progress for:", session.user.email);
          
          const response = await fetch(`/api/parents/progress?parentEmail=${session.user.email}`);
          if (!response.ok) throw new Error("Failed to fetch progress data");
          
          const data = await response.json();
          console.log("Progress Data:", data);

          setProgressData(data.progress || []);
        } catch (error) {
          console.error("Error fetching progress data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchProgress();
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6">Loading progress data...</Typography>
      </Container>
    );
  }

  if (!progressData || progressData.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Header />
        <Typography variant="h5" align="center">
          No progress data available.
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Children's Progress
        </Typography>

        <Grid container spacing={2}>
          {progressData.map((child) => (
            <Grid item xs={12} sm={6} key={child.name}>
              <DynamicCard>
                <CardContent>
                  <Typography variant="h6">{child.name}</Typography>
                  <Typography>Lesson Progress: {child.lessonProgress}%</Typography>
                  <Typography>Quiz Progress: {child.quizProgress}%</Typography>
                </CardContent>
              </DynamicCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
