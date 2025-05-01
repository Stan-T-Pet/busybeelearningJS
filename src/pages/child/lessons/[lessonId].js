import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import Header from "../../../components/Header";

export default function LessonPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { lessonId } = router.query;

  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        const res = await axios.get(`/api/lessons/${lessonId}`);
        setLesson(res.data);
      } catch (err) {
        setError("Failed to load lesson.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  const handleCompleteAndQuiz = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    try {
      await axios.post("/api/progress/update", {
        childId: session.user.id,
        contentType: "lesson",
        contentId: lesson._id,
        courseId: lesson.courseId,
        action: "complete",
      });

      const quizRes = await axios.get(`/api/quizzes/byLesson?lessonId=${lesson._id}`);
      const quizzes = quizRes.data.quizzes;

      if (quizzes.length > 0) {
        router.push(`/child/quiz?courseId=${lesson.courseId}`);
      } else {
        alert("No quizzes available for this lesson yet. Great job finishing!");
        router.push("/child/dashboard");
      }
    } catch (err) {
      console.error("Failed to update progress or load quizzes:", err);
    }
  };

  if (loading) {
    return (
      <Box minHeight="60vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container>
        <Typography variant="h6">Lesson not found.</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ background: "#f7f7f7", minHeight: "100vh" }}>
      <Header />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <DynamicCard elevation={4} sx={{ borderRadius: 4, p: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SchoolIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {lesson.title}
              </Typography>
            </Box>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Course: {lesson.courseTitle || lesson.subject}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <div dangerouslySetInnerHTML={{ __html: lesson.content || "<p>No content available.</p>" }} />
            </Box>

            <Box mt={4} display="flex" justifyContent="flex-end">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleCompleteAndQuiz}
              >
                Complete Lesson & Start Quiz
              </Button>
            </Box>
          </CardContent>
        </DynamicCard>
      </Container>
    </Box>
  );
}
