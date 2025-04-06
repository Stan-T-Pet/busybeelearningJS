import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';

export default function LessonPage() {
  const router = useRouter();
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
        setError('Failed to load lesson.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card elevation={4} sx={{ borderRadius: 4, p: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <SchoolIcon color="primary" sx={{ mr: 1 }} />
            <Typography variant="h4" fontWeight="bold">
              {lesson.title}
            </Typography>
          </Box>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Subject: {lesson.subject}
          </Typography>

          <Typography variant="body1" sx={{ mt: 2, lineHeight: 1.8 }}>
            {lesson.content || lesson.description}
          </Typography>

          <Box mt={4} display="flex" justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={async () => {
                try {
                  await axios.post("/api/lessons/progress", {
                    childId: session.user.id,
                    contentType: "lesson",
                    contentId: lesson._id,
                    subject: lesson.subject,
                    courseId: lesson.courseId, // may be undefined for older lessons
                    completed: true
                  });
                  router.push("/child/quiz");
                } catch (err) {
                  console.error("Failed to save progress:", err);
                }
              }}              
            >
              Start Quiz
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
